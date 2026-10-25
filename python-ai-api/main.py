import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from openai import OpenAI

load_dotenv()

# OpenRouter API Key provided in .env
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

if not OPENROUTER_API_KEY:
    raise RuntimeError("OPENROUTER_API_KEY is missing from .env")

# Initialize OpenAI client pointed to OpenRouter endpoint
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_API_KEY,
    default_headers={
        "HTTP-Referer": os.getenv("HTTP_REFERER", "http://localhost:8000"),
        "X-Title": os.getenv("X_TITLE", "AI Assistant API"),
    },
)

# OpenRouter Model Name: ChatGPT-4o (openai/gpt-4o)
MODEL_NAME = os.getenv("MODEL_NAME", "openai/gpt-4o")
MAX_TOKENS = int(os.getenv("MAX_TOKENS", "1000"))

app = FastAPI(title="AI Website API (OpenRouter - ChatGPT o4)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict this to your website domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str


@app.get("/")
async def root():
    return {
        "status": "online",
        "message": "AI API is running with OpenRouter",
        "model": MODEL_NAME,
        "max_tokens": MAX_TOKENS,
    }


@app.post("/api/chat")
async def chat(request: ChatRequest):
    if not request.message.strip():
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty",
        )

    def generate():
        try:
            stream = client.chat.completions.create(
                model=MODEL_NAME,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful and intelligent AI assistant.",
                    },
                    {
                        "role": "user",
                        "content": request.message,
                    },
                ],
                max_tokens=MAX_TOKENS,
                stream=True,
            )

            for chunk in stream:
                if chunk.choices and chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content

        except Exception as error:
            yield f"\n[ERROR] {str(error)}"

    return StreamingResponse(
        generate(),
        media_type="text/plain",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
