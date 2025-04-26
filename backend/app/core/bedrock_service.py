# app/core/bedrock_service.py

import json
import boto3
# from langchain.llms.bedrock import Bedrock
from langchain_community.chat_models import BedrockChat
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from .config import settings
import json
import re

# 初始化 Boto3 客户端
bedrock_client = boto3.client(
    service_name="bedrock-runtime",
    region_name=settings.AWS_REGION,
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    aws_session_token=settings.AWS_SESSION_TOKEN,
)

# 初始化 LangChain 的 Bedrock LLM
llm = BedrockChat(
    model_id=settings.BEDROCK_MODEL_ID,
    client=bedrock_client,
    model_kwargs={
        # "max_tokens_to_sample": 2000,
        "temperature": settings.TEMPERATURE
    }
)

# 只建立一个 PromptTemplate / Chain 实例即可复用
template = PromptTemplate(
    input_variables=["instruction", "image_base64"],
    template="""
        {instruction}

        Image(base64):
        {image_base64}
        """
)
chain = LLMChain(llm=llm, prompt=template)


class BedrockService:
    """简洁版：通过 LLMChain.run() 调用 Bedrock，不用 invoke_model."""

    def classify_trash(self, image_base64: str) -> dict:
        instruction = (
            "請分析這張圖並以 JSON 格式回傳垃圾的大分類 (Recyclable/Organic/General)，以及細分類(Plastic/Glass/Metal/Paper)。只回傳json，不要有其他文字。"
            " 例如：{'category': 'Recyclable', 'sub_category': 'Metal'}。"
        )
        # 1) 调用 chain.run，内部会调用 llm.generate()
        raw = chain.run({
            "instruction": instruction,
            "image_base64": image_base64
        })
        # 2) 解析 JSON
        print(raw)
        try:
            return json.loads(raw)
        except json.JSONDecodeError as e:
            raise ValueError(f"Bedrock 返回不是合法 JSON: {raw}")

    def verify_disposal(self, image_base64: str) -> dict:
        instruction = (
            "Analyze the image carefully and determine ONLY if it shows the correct action of properly disposing of trash. "
            "Proper disposal means clearly throwing or placing trash into a trash bin, trash container, or any appropriate disposal method. "
            "Additionally, classify the type of trash shown.\n\n"
            
            "Return ONLY a JSON object in the following exact structure:\n"
            "{\n"
            "  'reason': 'concise explanation (7 words or fewer)',\n"
            "  'passed': true or false,\n"
            "  'category': 'recyclable' or 'non-recyclable',\n"
            "  'sub_category': 'specific type of trash'\n"
            "}\n"
            "Do not add any extra text beyond the JSON output.\n\n"

            "Passing Conditions (for 'passed': true):\n"
            "- Trash is actively and clearly being thrown or placed into a trash bin, container, or appropriate disposal method.\n"
            "- Both the trash and the bin/container must be clearly visible.\n"
            "- The action of disposal must be clearly identifiable.\n\n"

            "Failing Conditions (for 'passed': false):\n"
            "- No visible trash and/or no visible trash bin/container.\n"
            "- Trash is being held but not thrown or placed.\n"
            "- The trash is far from the bin/container without clear disposal action.\n"
            "- Only partial action is visible (e.g., only a hand, no trash or bin).\n"
            "- Image shows irrelevant or unrelated objects (e.g., landscapes, vehicles, animals, backgrounds).\n"
            "- No active disposal action happening.\n"
            "- Any image that is intentionally misleading or not related to trash disposal.\n\n"

            "If the disposal action is unclear (trash present but no clear throwing/placing), respond with:\n"
            "{'reason': 'No clear disposal action', 'passed': false, 'category': (classified category), 'sub_category': (classified sub-category)}\n\n"

            "If the image is irrelevant (not trash-related), respond with:\n"
            "{'reason': 'Irrelevant image', 'passed': false, 'category': 'non-recyclable', 'sub_category': 'none'}\n\n"

            "Trash Classification Rules:\n"
            "- If the trash is recyclable, set 'category' to 'recyclable' and choose 'sub_category' from:\n"
            "  'paper and cardboard', 'plastics', 'glass', 'metals', 'batteries and electronics', 'food and organic waste', 'others'.\n"
            "- If the trash is non-recyclable, set 'category' to 'non-recyclable' and 'sub_category' to 'others'.\n\n"

            "Important Notes:\n"
            "- Always classify the trash type if trash is visible, even if the disposal action fails.\n"
            "- Only use 'sub_category': 'none' if the image is irrelevant or not showing trash.\n"
            "- Keep the 'reason' very concise: maximum 7 words."
            "- Remember to use the exact JSON format as specified without error!"
        )
        
        raw = chain.run({
            "instruction": instruction,
            "image_base64": image_base64
        })
        
        try:
            result = json.loads(raw)
            return result
        except json.JSONDecodeError:
            # Try to repair and parse again
            repaired = repair_json_string(raw)
            try:
                result = json.loads(repaired)
                return result
            except json.JSONDecodeError:
                raise ValueError(f"Bedrock returned invalid JSON even after repair: {repaired}")

def repair_json_string(raw: str) -> str:
    # Remove code block markers if present
    raw = re.sub(r'```json|```', '', raw).strip()

    # Replace single quotes with double quotes
    # But be careful with things like: "don't" -> "don\"t"
    raw = raw.replace("'", '"')

    # Ensure true/false/null are lowercase (JSON style)
    raw = re.sub(r'\bTrue\b', 'true', raw)
    raw = re.sub(r'\bFalse\b', 'false', raw)
    raw = re.sub(r'\bNone\b', 'null', raw)

    return raw

