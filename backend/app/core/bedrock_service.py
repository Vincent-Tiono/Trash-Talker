# app/core/bedrock_service.py

import base64
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

# Polly client for TTS
polly_client = boto3.client(
    service_name="polly",
    region_name=settings.AWS_REGION,
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    aws_session_token=settings.AWS_SESSION_TOKEN,
)

translate_client = boto3.client(
    service_name="translate",
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

def translate_to_chinese(text: str) -> str:
    # Use AWS Translate or an external API
    response = translate_client.translate_text(
        Text=text,
        SourceLanguageCode='en',
        # mandarin taiwanese
        TargetLanguageCode='zh-TW',  # Change to 'zh-CN' for simplified Chinese
    )
    return response['TranslatedText']

class PollyService:
    """Service to interact with AWS Polly for text-to-speech."""

    def synthesize_speech(self, text: str):
        try:
            print("Original text:", text)
            text = translate_to_chinese(text)
            print("Translated text:", text)

            response = polly_client.synthesize_speech(
                Text=text,
                VoiceId='Zhiyu',  # Chinese voice
                OutputFormat='mp3',
                LanguageCode='cmn-CN',  # Chinese Mandarin
            )
            
            audio_stream = response.get("AudioStream")
            if audio_stream:
                audio_data = audio_stream.read()
                audio_base64 = base64.b64encode(audio_data).decode('utf-8')
                return {
                    "audio": audio_base64,
                    "content_type": response.get("ContentType")
                }
            else:
                raise ValueError("Failed to synthesize speech, no AudioStream returned.")

        except Exception as e:
            raise ValueError(f"Error during speech synthesis: {str(e)}")

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
        instruction = """
        Analyze the image carefully and classify the trash type with strict certainty. Return ONLY a JSON object in this exact structure: 
        {"category": "recyclable" or "non-recyclable", "sub_category": "specific type of trash"}.

        Strict Classification Rules:
        - Both trash and a trash bin or container must be visible in the image. At least one of them must be clearly noticeable. Partial visibility of either trash or bin is acceptable, but both must be present to ensure proper classification. If either trash or bin is missing or barely visible, do not classify.
        - If the trash bin or container is visible but without trash, consider it for classification, but ensure that the bin or container is clearly noticeable and identifiable.
        - If recyclable, 'sub_category' must strictly match one of the following: 'paper and cardboard', 'plastics', 'glass', 'metals', 'batteries and electronics', 'food and organic waste', 'others'. If the item does not match these categories, classify as non-recyclable.
        - If non-recyclable, set 'sub_category' to 'others'. Ensure that the item is clearly not recyclable in any way.
        - Examples:
        * Book → recyclable / paper and cardboard
        * Plastic bottle → recyclable / plastics
        * Banana peel → recyclable / food and organic waste
        * Smartphone → recyclable / batteries and electronics
        * Broken ceramic → non-recyclable / others
        * Fast food wrapper → non-recyclable / others
        - If the item is ambiguous, partially hidden, blurred, or not confidently recognizable as trash, classify as non-recyclable / others. Do not make guesses or assumptions.
        - If the item is not clearly trash, or the image is of an irrelevant object or scene, classify as non-recyclable / others and set 'sub_category' to 'none'. For example, a picture of a car or a person is irrelevant and should be classified as 'non-recyclable' with 'sub_category' as 'none'.
        - Items that are not clearly identifiable should not be classified as recyclable or non-recyclable. Use 'others' only when the item is confirmed to be trash but doesn't fit in other categories.

        Other Important Rules:
        - Always use lowercase for 'category' and 'sub_category'.
        - Only return pure JSON without any extra text, explanations, or notes.
        - If there is any doubt regarding the item type or classification, mark it as non-recyclable and set the sub_category to 'others'.
        """


        raw = chain.run({
            "instruction": instruction,
            "image_base64": image_base64
        })
        print("Raw response classify_trash:", raw)
        return self._parse_response(raw)

    def verify_disposal(self, image_base64: str) -> dict:
        """Verify if trash is correctly disposed and classify it."""
        instruction = """
                Analyze the image and determine if it likely shows the action of disposing trash properly.

                Return ONLY a JSON object in this exact structure:
                {
                "reason": "concise explanation (7 words or fewer)",
                "passed": true or false,
                "category": "recyclable" or "non-recyclable",
                "sub_category": "specific type of trash"
                }

                Passing Conditions (for 'passed': true):
                - Trash and bin/container are at least partially visible.
                - The action of disposal is reasonably clear.
                - Prioritize if both trash and bin are visible. If only one is visible, consider it less verified but valid if the action is clear.
                - If both trash and bin are visible, it's definitely verified.

                Failing Conditions (for 'passed': false):
                - No noticeable trash or bin.
                - Only trash visible, no bin/container.
                - if it's only bin, maybe consider partially visible trash.
                - Image completely irrelevant (not related to disposal).

                Special Cases:
                - If no noticeable trash or bin: reason = "No visible bin or trash", passed = false.
                - If irrelevant image: reason = "Irrelevant image", passed = false, category = "non-recyclable", sub_category = "none".

                Other Important Rules:
                - Always classify visible trash even if disposal attempt is unclear.
                - Use only lowercase for category and sub_category.
                - Output only pure JSON. No extra explanation.
                """

        raw = chain.run({
            "instruction": instruction,
            "image_base64": image_base64
        })
        print("Raw response verify_disposal:", raw)
        return self._parse_response(raw)
