import json
from pathlib import Path

NOTES_FILE = Path("/tmp/notes.jsonl")

def get_all_notes():
    if not NOTES_FILE.exists():
        return []
    notes = []
    for line in NOTES_FILE.open():
        if line.strip():
            try:
                notes.append(json.loads(line))
            except:
                pass
    return notes

def handler(event, context):
    try:
        body = json.loads(event.get("body", "{}"))
        query = body.get("q", "").lower().strip()
        notes = get_all_notes()
        matches = [n for n in notes if query in n["text"].lower()]
        return {"statusCode": 200, "body": json.dumps({"matches": matches})}
    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}
