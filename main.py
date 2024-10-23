from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import asyncio
from edge_tts import VoicesManager
from io import BytesIO
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

PORT = os.environ.get('PORT', 8000)

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

class TTSRequest(BaseModel):
    text: str
    language: str

async def get_edge_tts(text: str, speaker: str) -> bytes:
    async def async_generate_audio(text: str, speaker: str) -> bytes:
        try:
            communicate = edge_tts.Communicate(text, speaker)
            audio_data = b''
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    audio_data += chunk["data"]
            return audio_data
        except Exception as e:
            print("Error generating audio using edge_tts:", e)
            raise

    try:
        return await async_generate_audio(text, speaker)
    except Exception as e:
        return b""

@app.post("/api/tts")
async def tts(request: TTSRequest):
    text = request.text
    speaker = request.language
    audio_data = await get_edge_tts(text, speaker)
    if not audio_data:
        return {"error": "Audio generation failed"}

    audio_stream = BytesIO(audio_data)
    audio_stream.seek(0)
    return StreamingResponse(audio_stream, media_type="audio/wav")

@app.get("/", response_class=HTMLResponse)
async def read_root():
    with open("static/index.html") as f:
        return HTMLResponse(content=f.read())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)
