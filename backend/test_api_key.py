import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
print(f"API Key (first 20 chars): {api_key[:20]}...")

genai.configure(api_key=api_key)

# Try to make a simple request without specifying a model
print("\nTrying to list models...")
try:
    models = list(genai.list_models())
    print(f"Found {len(models)} models")
    for m in models[:5]:
        print(f"  - {m.name}")
except Exception as e:
    print(f"Error listing models: {e}")

# Try a simple generation with different model names
model_names = ['gemini-pro', 'models/gemini-pro', 'gemini-1.5-flash', 'models/gemini-1.5-flash', 'gemini-1.5-pro', 'models/gemini-1.5-pro']

for model_name in model_names:
    try:
        print(f"\nTrying model: {model_name}")
        model = genai.GenerativeModel(model_name)
        response = model.generate_content("Say hello")
        print(f"  ✓ SUCCESS: {response.text[:50]}")
        break
    except Exception as e:
        print(f"  ✗ FAILED: {str(e)[:100]}")
