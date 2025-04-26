# app/core/bedrock_service.py
from langchain_community.chat_models import BedrockChat
from langchain.chains import LLMChain
from langchain.prompts import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate
)
from langchain.schema import SystemMessage, ChatMessage, HumanMessage
import json
from .config import settings

class BedrockService:
    def __init__(self):
        self.llm = BedrockChat(
            region_name=settings.AWS_REGION,
            model_id=settings.BEDROCK_MODEL_ID,
            model_kwargs={"temperature": settings.TEMPERATURE}
        )
        prompt_template = ChatPromptTemplate.from_messages([
            SystemMessagePromptTemplate.from_template("{system_prompt}"),
            HumanMessagePromptTemplate.from_template("{user_prompt}")
        ])
        self.chain = LLMChain(
            llm=self.llm,
            prompt=prompt_template
        )
        self.system_prompt = settings.SYSTEM_PROMPT

    def classify_trash(self, image_base64: str) -> dict:
        return self._call_with_image(
            image_base64,
            "請分析這張圖並以 JSON 格式回傳垃圾的大分類 (Recyclable/Organic/General) 以及細分類(sub_category)。"
        )

    def verify_disposal(self, image_base64: str) -> dict:
        return self._call_with_image(
            image_base64,
            "這張圖是否顯示使用者正確丟棄垃圾？請以 JSON 格式回傳 {passed: boolean, reason: string}。"
        )

    def _call_with_image(self, image_base64: str, instruction: str) -> dict:
        messages = [
            SystemMessage(content=self.system_prompt),
            ChatMessage(
                content=image_base64,
                additional_kwargs={"type": "image", "media_type": "image/png"}
            ),
            HumanMessage(content=instruction)
        ]
        resp = self.llm.generate([messages])
        text = resp.generations[0][0].text.strip()
        return json.loads(text)
