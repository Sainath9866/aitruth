import requests
import time

BASE_URL = "http://localhost:8001"

def test_api():
    print("Testing API...")
    
    # 1. Check Root
    try:
        res = requests.get(f"{BASE_URL}/")
        print(f"Root: {res.status_code} - {res.json()}")
    except Exception as e:
        print(f"Failed to connect to API: {e}")
        return

    # 2. Create Question
    question_data = {
        "text": "What is 2 + 2?",
        "subject": "Math",
        "reference_answer": "4",
        "difficulty": "Easy"
    }
    res = requests.post(f"{BASE_URL}/questions/", json=question_data)
    print(f"Create Question: {res.status_code}")
    if res.status_code == 200:
        q_id = res.json()["id"]
        print(f"Created Question ID: {q_id}")
        
        # 3. List Questions
        res = requests.get(f"{BASE_URL}/questions/")
        print(f"List Questions: {len(res.json())} items")

        # 4. Run Evaluation
        print("Running Evaluation...")
        res = requests.post(f"{BASE_URL}/evaluations/run/{q_id}?model_provider=openai&model_name=gpt-4o")
        print(f"Evaluation Result: {res.status_code}")
        if res.status_code == 200:
            print(f"Score: {res.json()}")

if __name__ == "__main__":
    test_api()
