import json
from fastapi import Request
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

async def handler(request: Request):
    try:
        body = await request.json()
        query = body.get("q", "").lower().strip()
        notes = get_all_notes()
        matches = [n for n in notes if query in n["text"].lower()]
        return {"matches": matches}
    except Exception as e:
        return {"error": str(e)}
