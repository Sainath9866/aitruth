import os
from typing import Dict
from dotenv import load_dotenv
import openai
import google.generativeai as genai  # Using stable generativeai library
from anthropic import Anthropic
from groq import Groq

load_dotenv()

class LLMService:
    def __init__(self):
        # Initialize clients if keys are present
        self.openai_key = os.getenv("OPENAI_API_KEY")
        if self.openai_key:
            self.openai_client = openai.OpenAI(api_key=self.openai_key)
            
        self.anthropic_key = os.getenv("ANTHROPIC_API_KEY")
        if self.anthropic_key:
            self.anthropic_client = Anthropic(api_key=self.anthropic_key)
            
        self.google_key = os.getenv("GOOGLE_API_KEY")
        if self.google_key:
            genai.configure(api_key=self.google_key)
            
        self.groq_key = os.getenv("GROQ_API_KEY")
        if self.groq_key:
            self.groq_client = Groq(api_key=self.groq_key)

    async def get_response(self, model_provider: str, model_name: str, prompt: str) -> str:
        """
        Fetches a response from the specified AI model.
        """
        # Map 'auto' to default model names
        default_models = {
            "openai": "gpt-4o",
            "google": "gemini-2.5-flash",  # Latest Gemini 2.5 Flash
            "anthropic": "claude-sonnet-4-5",  # Latest Claude Sonnet 4.5
            "deepseek": "deepseek-chat",
            "meta": "llama-3.1-70b-versatile"
        }
        
        if model_name == "auto" or not model_name:
            model_name = default_models.get(model_provider, "gpt-4o")
        
        try:
            if model_provider == "openai":
                if not self.openai_key: return "Error: OPENAI_API_KEY not configured"
                return await self._call_openai(model_name, prompt)
            elif model_provider == "google":
                if not self.google_key: return "Error: GOOGLE_API_KEY not configured"
                return await self._call_google(model_name, prompt)
            elif model_provider == "anthropic":
                if not self.anthropic_key: return "Error: ANTHROPIC_API_KEY not configured"
                return await self._call_anthropic(model_name, prompt)
            elif model_provider == "meta":
                if not self.groq_key: return "Error: GROQ_API_KEY (for Meta) not configured"
                return await self._call_meta(model_name, prompt)
            elif model_provider == "deepseek":
                # DeepSeek often uses OpenAI compatible API
                if not os.getenv("DEEPSEEK_API_KEY"): return "Error: DEEPSEEK_API_KEY not configured"
                return await self._call_deepseek(model_name, prompt)
            else:
                return f"Error: Unknown provider {model_provider}"
        except Exception as e:
            return f"Error calling {model_name}: {str(e)}"

    async def _call_openai(self, model: str, prompt: str) -> str:
        response = self.openai_client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content

    async def _call_google(self, model_name: str, prompt: str) -> str:
        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error calling Google model {model_name}: {str(e)}"

    async def _call_anthropic(self, model_name: str, prompt: str) -> str:
        try:
            message = self.anthropic_client.messages.create(
                model=model_name,
                max_tokens=1024,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )
            return message.content[0].text
        except Exception as e:
            return f"Error calling Anthropic model {model_name}: {str(e)}"

    async def _call_meta(self, model: str, prompt: str) -> str:
        # Using Groq for Meta Llama models
        chat_completion = self.groq_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model=model,
        )
        return chat_completion.choices[0].message.content

    async def _call_deepseek(self, model: str, prompt: str) -> str:
        client = openai.OpenAI(
            api_key=os.getenv("DEEPSEEK_API_KEY"), 
            base_url="https://api.deepseek.com"
        )
        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content
