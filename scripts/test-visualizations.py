#!/usr/bin/env python3
"""
Test all AI visualization endpoints
"""
import requests
import json
import sys

BASE_URL = "https://www.brandonmills.com"

def test_mind_visualizer():
    print("\n" + "="*60)
    print("🧠 TESTING: Mind Visualizer API")
    print("="*60)

    endpoint = f"{BASE_URL}/api/gemini/analyze"
    payload = {
        "text": "I want to understand creativity and innovation in technology"
    }

    try:
        response = requests.post(endpoint, json=payload, timeout=120)
        data = response.json()

        if response.status_code == 200 and 'analysis' in data:
            print(f"✅ SUCCESS: Status {response.status_code}")
            print(f"   Response keys: {list(data.keys())}")
            print(f"   Analysis preview: {str(data['analysis'])[:150]}...")
            return True
        else:
            print(f"❌ FAILED: Status {response.status_code}")
            print(f"   Response: {json.dumps(data, indent=2)[:300]}")
            return False
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return False

def test_dream_decoder():
    print("\n" + "="*60)
    print("💭 TESTING: Dream Decoder API")
    print("="*60)

    endpoint = f"{BASE_URL}/api/gemini/dream"
    payload = {
        "dream": "I was flying over a beautiful landscape with colorful mountains"
    }

    try:
        response = requests.post(endpoint, json=payload, timeout=120)
        data = response.json()

        if response.status_code == 200 and 'analysis' in data:
            print(f"✅ SUCCESS: Status {response.status_code}")
            print(f"   Response keys: {list(data.keys())}")
            print(f"   Analysis preview: {str(data['analysis'])[:150]}...")
            return True
        else:
            print(f"❌ FAILED: Status {response.status_code}")
            print(f"   Response: {json.dumps(data, indent=2)[:300]}")
            return False
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return False

def test_life_path_oracle():
    print("\n" + "="*60)
    print("🔮 TESTING: Life Path Oracle API")
    print("="*60)

    endpoint = f"{BASE_URL}/api/gemini/lifepath"
    payload = {
        "answers": {
            "values": "Creativity, innovation, helping others grow",
            "fears": "Stagnation, not reaching my potential",
            "goals": "Build something meaningful that helps people",
            "strengths": "Problem-solving, empathy, persistence",
            "relationships": "Deep connections with like-minded people",
            "challenges": "Balancing ambition with patience",
            "dreams": "Creating positive impact at scale",
            "legacy": "Leaving the world better than I found it"
        }
    }

    try:
        response = requests.post(endpoint, json=payload, timeout=120)
        data = response.json()

        if response.status_code == 200 and 'analysis' in data:
            print(f"✅ SUCCESS: Status {response.status_code}")
            print(f"   Response keys: {list(data.keys())}")
            print(f"   Analysis preview: {str(data['analysis'])[:150]}...")
            return True
        else:
            print(f"❌ FAILED: Status {response.status_code}")
            print(f"   Response: {json.dumps(data, indent=2)[:300]}")
            return False
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return False

def main():
    print("\n" + "🧪"*30)
    print(" AI VISUALIZATION BACKEND API TESTS")
    print("🧪"*30)

    results = {
        "Mind Visualizer": test_mind_visualizer(),
        "Dream Decoder": test_dream_decoder(),
        "Life Path Oracle": test_life_path_oracle()
    }

    print("\n" + "="*60)
    print("📊 TEST SUMMARY")
    print("="*60)

    total = len(results)
    passed = sum(1 for v in results.values() if v)
    failed = total - passed

    for name, status in results.items():
        status_icon = "✅" if status else "❌"
        print(f"{status_icon} {name}: {'PASS' if status else 'FAIL'}")

    print("\n" + f"Total: {total} | Passed: {passed} | Failed: {failed}")
    print("="*60 + "\n")

    sys.exit(0 if failed == 0 else 1)

if __name__ == "__main__":
    main()
