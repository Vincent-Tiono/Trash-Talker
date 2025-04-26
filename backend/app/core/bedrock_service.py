# app/core/bedrock_service.py

import json
import boto3
# from langchain.llms.bedrock import Bedrock
from langchain_community.chat_models import BedrockChat
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from .config import settings

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
            "這張圖是否顯示使用者正確丟棄垃圾？"
            " 請只以 JSON 格式回傳 {{passed: boolean, reason: string}}。"
        )
        raw = chain.run({
            "instruction": instruction,
            "image_base64": image_base64
        })
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            raise ValueError(f"Bedrock 返回不是合法 JSON: {raw}")
