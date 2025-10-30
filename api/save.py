import json
from pathlib import Path

NOTES_FILE = Path("/tmp/notes.jsonl")

def ensure_file():
    if not NOTES_FILE.exists():
        NOTES_FILE.write_text("")

def save_note(text: str):
    ensure_file()
    entry = {"text": text.strip()}
    NOTES_FILE.open("a").write(json.dumps(entry) + "\n")

def handler(event, context):
    try:
        body = json.loads(event.get("body", "{}"))
        text = body.get("text", "").strip()
        if not text:
            return {"statusCode": 400, "body": json.dumps({"error": "empty"})}
        save_note(text)
        return {"statusCode": 200, "body": json.dumps({"status": "saved"})}
    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}
