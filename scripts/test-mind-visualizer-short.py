#!/usr/bin/env python3
import requests
import json

response = requests.post(
    'https://www.brandonmills.com/api/gemini/analyze',
    json={'text': 'Innovation and creativity drive progress in modern society and business'},
    timeout=120
)

data = response.json()

if response.status_code == 200 and 'analysis' in data:
    print('✅ SUCCESS: Mind Visualizer works with short text')
    print(f'Response keys: {list(data.keys())}')
    print(f'Concepts: {data["analysis"].get("conceptCount", "N/A")}')
    print(f'Archetype: {data["analysis"].get("dominantArchetype", "N/A")}')
    exit(0)
elif 'error' in data:
    print(f'❌ FAILED: {data["error"]}')
    print(f'Hint: {data.get("hint", "none")}')
    exit(1)
else:
    print('❌ Unexpected response')
    exit(1)
