import json
from fastapi import Request, Response
from pathlib import Path

NOTES_FILE = Path("/tmp/notes.jsonl")

def ensure_file():
    if not NOTES_FILE.exists():
        NOTES_FILE.write_text("")

def save_note(text: str):
    ensure_file()
    entry = {"text": text.strip()}
    NOTES_FILE.open("a").write(json.dumps(entry) + "\n")

async def handler(request: Request):
    try:
        body = await request.json()
        text = body.get("text", "").strip()
        if not text:
            return Response('{"error":"empty"}', status_code=400)
        save_note(text)
        return {"status": "saved"}
    except Exception as e:
        return Response(f'{{"error":"{str(e)}"}}', status_code=500)
