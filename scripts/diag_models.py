import os
import google.generativeai as genai
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv("frontend/.env")

def list_google_models():
    print("\n--- Google Models ---")
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("GOOGLE_API_KEY not found")
        return
    try:
        genai.configure(api_key=api_key)
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(m.name)
    except Exception as e:
        print(f"Error listing Google models: {e}")

def list_anthropic_models():
    print("\n--- Anthropic Models ---")
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        print("ANTHROPIC_API_KEY not found")
        return
    # Anthropic doesn't have a simple list_models in the SDK, 
    # but we can try a few common ones to see what works.
    models = [
        "claude-3-5-sonnet-20240620",
        "claude-3-5-sonnet-20241022",
        "claude-3-opus-20240229",
        "claude-3-sonnet-20240229",
        "claude-3-haiku-20240307",
        "claude-2.1"
    ]
    client = Anthropic(api_key=api_key)
    for model in models:
        try:
            client.messages.create(
                model=model,
                max_tokens=1,
                messages=[{"role": "user", "content": "hi"}]
            )
            print(f"{model}: SUCCESS")
        except Exception as e:
            print(f"{model}: FAILED ({e})")

if __name__ == "__main__":
    list_google_models()
    list_anthropic_models()
