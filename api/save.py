import json
from pathlib import Path

NOTES_FILE = Path("/tmp/notes.jsonl")

def handler(event, context):
    try:
        body = json.loads(event.get("body", "{}"))
        text = body.get("text", "").strip()
        if not text:
            return {"statusCode": 400, "body": json.dumps({"error": "empty"})}
        
        with NOTES_FILE.open("a") as f:
            f.write(json.dumps({"text": text}) + "\n")
        
        return {"statusCode": 200, "body": json.dumps({"status": "saved"})}
    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}
