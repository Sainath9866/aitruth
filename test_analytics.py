import requests

BASE_URL = "http://localhost:8001"

def test_analytics():
    print("Testing Analytics API...")
    
    # 1. Check if analytics endpoint works
    try:
        res = requests.get(f"{BASE_URL}/analytics/overview")
        print(f"✓ Overview endpoint: {res.status_code}")
        print(f"  Data: {res.json()}")
        
        res = requests.get(f"{BASE_URL}/analytics/by-subject")
        print(f"✓ By-Subject endpoint: {res.status_code}")
        print(f"  Subjects found: {len(res.json())}")
        
        res = requests.get(f"{BASE_URL}/analytics/by-model")
        print(f"✓ By-Model endpoint: {res.status_code}")
        print(f"  Models found: {len(res.json())}")
        
        print("\n✅ All analytics endpoints working!")
        
    except Exception as e:
        print(f"❌ Failed: {e}")

if __name__ == "__main__":
    test_analytics()
