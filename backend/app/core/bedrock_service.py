# app/core/bedrock_service.py

import json
import boto3
import re
from langchain_community.chat_models import BedrockChat
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from .config import settings

# Initialize Boto3 Bedrock client
bedrock_client = boto3.client(
    service_name="bedrock-runtime",
    region_name=settings.AWS_REGION,
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    aws_session_token=settings.AWS_SESSION_TOKEN,
)

# Initialize Bedrock LLM
llm = BedrockChat(
    model_id=settings.BEDROCK_MODEL_ID,
    client=bedrock_client,
    model_kwargs={
        "temperature": settings.TEMPERATURE
    }
)

# Shared prompt template
template = PromptTemplate(
    input_variables=["instruction", "image_base64"],
    template="""
        {instruction}

        Image (base64):
        {image_base64}
    """
)
chain = LLMChain(llm=llm, prompt=template)


class BedrockService:
    """Service to interact with AWS Bedrock for trash classification and disposal verification."""

    def _parse_response(self, raw: str) -> dict:
        """Helper to fix Bedrock output and parse it safely."""
        if not raw:
            raise ValueError("Empty response from Bedrock.")

        # Fix common mistakes: use double quotes
        fixed_raw = raw.strip()
        fixed_raw = re.sub(r"(?<!\\)'", '"', fixed_raw)  # replace single quotes with double quotes
        
        # Remove any leading/trailing content outside JSON
        match = re.search(r"({.*})", fixed_raw, re.DOTALL)
        if not match:
            raise ValueError(f"Invalid JSON format from Bedrock: {raw}")
        
        json_str = match.group(1)
        
        try:
            parsed = json.loads(json_str)
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse JSON: {json_str}") from e

        # Normalize output: ensure all values like 'category' and 'sub_category' are lowercase
        if 'category' in parsed and isinstance(parsed['category'], str):
            parsed['category'] = parsed['category'].lower()

        if 'sub_category' in parsed and isinstance(parsed['sub_category'], str):
            parsed['sub_category'] = parsed['sub_category'].lower()

        # Also lowercase 'reason' if it exists (optional)
        if 'reason' in parsed and isinstance(parsed['reason'], str):
            parsed['reason'] = parsed['reason'].strip()

        return parsed

    def classify_trash(self, image_base64: str) -> dict:
        """Classify trash type based on image."""
        instruction = (
            "Analyze the image carefully and classify the type of trash shown.\n\n"
            "Return ONLY a JSON object in this exact structure:\n"
            "{\n"
            "  \"category\": \"recyclable\" or \"non-recyclable\",\n"
            "  \"sub_category\": \"specific type of trash\"\n"
            "}\n"
            "Important Rules:\n"
            "- If recyclable, choose 'sub_category' from: "
            "'paper and cardboard', 'plastics', 'glass', 'metals', "
            "'batteries and electronics', 'food and organic waste', 'others'.\n"
            "- If non-recyclable, set 'sub_category' to 'others'.\n"
            "- If irrelevant image (not showing trash), set 'sub_category' to 'none'.\n"
            "- Return category and sub_category in **lowercase**.\n"
            "- Only return pure JSON. No additional text."
        )

        raw = chain.run({
            "instruction": instruction,
            "image_base64": image_base64
        })
        print("Raw response classify_trash:", raw)
        return self._parse_response(raw)

    def verify_disposal(self, image_base64: str) -> dict:
        """Verify if trash is correctly disposed and classify it."""
        instruction = (
            "Analyze the image carefully and determine ONLY if it shows the correct action of properly disposing trash.\n\n"
            "Return ONLY a JSON object in this exact structure:\n"
            "{\n"
            "  \"reason\": \"concise explanation (7 words or fewer)\",\n"
            "  \"passed\": true or false,\n"
            "  \"category\": \"recyclable\" or \"non-recyclable\",\n"
            "  \"sub_category\": \"specific type of trash\"\n"
            "}\n"
            "Passing Conditions (for 'passed': true):\n"
            "- Clear action of throwing/placing trash into bin/container.\n"
            "- Both trash and bin/container are clearly visible.\n\n"
            "Failing Conditions (for 'passed': false):\n"
            "- No visible bin/trash or unclear action.\n"
            "- Trash present but no disposal action.\n"
            "- Irrelevant image.\n\n"
            "Special Cases:\n"
            "- If unclear disposal action: reason = \"No clear disposal action\", passed = false.\n"
            "- If irrelevant image: reason = \"Irrelevant image\", passed = false, category = \"non-recyclable\", sub_category = \"none\".\n\n"
            "Other Important Rules:\n"
            "- Always classify visible trash even if disposal fails.\n"
            "- Always use lowercase for category and sub_category.\n"
            "- Only return pure JSON. No extra explanation."
        )

        raw = chain.run({
            "instruction": instruction,
            "image_base64": image_base64
        })
        print("Raw response verify_disposal:", raw)
        return self._parse_response(raw)
