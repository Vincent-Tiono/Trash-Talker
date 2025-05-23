import json
import boto3
import re
from langchain_community.chat_models import BedrockChat
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain.schema import HumanMessage
from .config import settings
import base64

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


class BedrockService:
    """Service to interact with AWS Bedrock for trash classification and disposal verification."""

    def _parse_response(self, raw: str) -> dict:
        """Helper to fix Bedrock output and parse it safely."""
        if not raw:
            raise ValueError("Empty response from Bedrock.")

        fixed_raw = raw.strip()
        fixed_raw = re.sub(r"(?<!\\)'", '"', fixed_raw)

        match = re.search(r"({.*})", fixed_raw, re.DOTALL)
        if not match:
            raise ValueError(f"Invalid JSON format from Bedrock: {raw}")

        json_str = match.group(1)

        try:
            parsed = json.loads(json_str)
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse JSON: {json_str}") from e

        if 'category' in parsed and isinstance(parsed['category'], str):
            parsed['category'] = parsed['category'].lower()

        if 'sub_category' in parsed and isinstance(parsed['sub_category'], str):
            parsed['sub_category'] = parsed['sub_category'].lower()

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

        # Create message content with text and image
        message_content = [
            {
                "type": "text",
                "text": instruction
            },
            {
                "type": "image_url",
                "image_url": {
                    "url": f"data:image/jpeg;base64,{image_base64}"
                }
            }
        ]
        
        # Create a human message with the multimodal content
        message = HumanMessage(content=message_content)
        
        # Invoke the model with the message
        response = llm.invoke([message])
        raw = response.content
        
        print("Raw response classify_trash:", raw)
        return self._parse_response(raw)

    def verify_disposal(self, image_base64: str) -> dict:
        """Verify if trash is correctly disposed and classify it."""
        instruction = """
        Analyze the image to determine if it shows trash and its bin or container either partially or not and please dont be so strict. Return a JSON object in this structure:

        {
        "reason": "concise explanation",
        "passed": true or false,
        "category": "recyclable" or "non-recyclable",
        "sub_category": "specific type of trash"
        }

        Conditions:
        - "passed": true if both trash and bin/container are visible and action is clear, partially is fine.
        - "passed": false if no trash or bin visible, or action doesn't pass.
        - Special cases: if trash bin is clearly visible but no trash, classify as passed.

        Strict Rules:
        - Always use lowercase for both 'category' and 'sub_category'.
        - No extra text or explanations, just the JSON.
        """

        # Create message content with text and image
        message_content = [
            {
                "type": "text",
                "text": instruction
            },
            {
                "type": "image_url",
                "image_url": {
                    "url": f"data:image/jpeg;base64,{image_base64}"
                }
            }
        ]
        
        # Create a human message with the multimodal content
        message = HumanMessage(content=message_content)
        
        # Invoke the model with the message
        response = llm.invoke([message])
        raw = response.content
        
        print("Raw response verify_disposal:", raw)
        return self._parse_response(raw)
    
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
