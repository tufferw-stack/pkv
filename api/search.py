import json
from pathlib import Path

NOTES_FILE = Path("/tmp/notes.jsonl")

def handler(event, context):
    try:
        body = json.loads(event.get("body", "{}"))
        query = body.get("q", "").lower().strip()
        notes = []
        if NOTES_FILE.exists():
            for line in NOTES_FILE.open():
                if line.strip():
                    try:
                        notes.append(json.loads(line))
                    except:
                        pass
        matches = [n for n in notes if query in n["text"].lower()]
        return {"statusCode": 200, "body": json.dumps({"matches": matches})}
    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}
