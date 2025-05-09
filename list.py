import requests
import json
import os

# เรียกข้อมูลจาก API
url = "https://api.ywc20.ywc.in.th/homework/candidates"
headers = {"x-reference-id": "PG18"}
response = requests.get(url, headers=headers)
data = response.json()   


desktop = os.path.join(os.path.expanduser("~"), "Desktop")
filepath = os.path.join(desktop, "candidates_PG18.json")

# เซฟเป็นไฟล์ JSON
with open(filepath, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print(f"เซฟข้อมูลสำเร็จในไฟล์ {filepath}")