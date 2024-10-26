import os
import logging
import base64
import json
import hashlib
import requests
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from cachetools import TTLCache, cached
from dotenv import load_dotenv
from PIL import Image
import io

# Load environment variables from .env file
load_dotenv()

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI instance
app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Replace with your actual API key
API_KEY = os.getenv("API_KEY")
invoke_url = "https://ai.api.nvidia.com/v1/gr/meta/llama-3.2-90b-vision-instruct/chat/completions"

# Cache with a Time-To-Live (TTL) of 10 minutes and a max size of 100 items
cache = TTLCache(maxsize=100, ttl=600)

def resize_image(image_data: bytes, max_size: tuple = (640, 480)) -> bytes:
    """
    Resize image to ensure it's within acceptable size limits while maintaining aspect ratio.
    """
    try:
        # Open image using PIL
        image = Image.open(io.BytesIO(image_data))
        
        # Convert to RGB if needed
        if image.mode in ('RGBA', 'LA') or (image.mode == 'P' and 'transparency' in image.info):
            background = Image.new('RGB', image.size, (255, 255, 255))
            background.paste(image, mask=image.split()[-1] if image.mode == 'RGBA' else None)
            image = background
        
        # Calculate aspect ratio and resize
        image.thumbnail(max_size, Image.Resampling.LANCZOS)
        
        # Save to bytes
        output_buffer = io.BytesIO()
        image.save(output_buffer, format='JPEG', quality=85, optimize=True)
        return output_buffer.getvalue()
    except Exception as e:
        logger.error(f"Error resizing image: {str(e)}")
        raise

def optimize_image_size(image_data: bytes, max_base64_size: int = 170_000) -> bytes:
    """
    Iteratively optimize image size until it fits within base64 size limits.
    """
    current_size = len(base64.b64encode(image_data))
    current_image = image_data
    
    if current_size <= max_base64_size:
        return current_image
    
    # Calculate initial dimensions based on current size ratio
    scale_factor = (max_base64_size / current_size) ** 0.5
    img = Image.open(io.BytesIO(image_data))
    new_size = (
        int(img.size[0] * scale_factor),
        int(img.size[1] * scale_factor)
    )
    
    return resize_image(image_data, new_size)

def generate_cache_key(image_b64: str) -> str:
    """Generate a unique cache key based on the image's base64 representation."""
    return hashlib.sha256(image_b64.encode()).hexdigest()

@cached(cache)
def get_threat_analysis(image_b64: str):
    """Get threat analysis from the AI model, cached based on image."""
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Accept": "application/json"
    }

    payload = {
        "model": 'meta/llama-3.2-90b-vision-instruct',
        "messages": [
            {
                "role": "user",
                "content": (
                    f"Analyze the image below for any potential threats to public safety. "
                    f"Please respond with 'dangerous' if a threat is detected, or 'not dangerous' otherwise. "
                    f"Include a description if a threat is present. "
                    f'<img src="data:image/jpeg;base64,{image_b64}" />'
                )
            }
        ],
        "max_tokens": 512,
        "temperature": 0,
        "top_p": 1.00
    }

    try:
        response = requests.post(invoke_url, headers=headers, json=payload)
        response.raise_for_status()
        
        json_response = response.json()
        if "choices" in json_response and json_response["choices"]:
            return json_response["choices"][0]["message"]["content"]
        
        logger.warning("No choices in the response.")
        return None
    except requests.exceptions.RequestException as e:
        logger.error(f"API request failed: {str(e)}")
        return None
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse API response: {str(e)}")
        return None

@app.post("/detect-threat/")
async def detect_threat(file: UploadFile = File(...)):
    try:
        logger.info(f"Received file: {file.filename}, Content Type: {file.content_type}")

        # Read the image file
        contents = await file.read()
        if not contents:
            return JSONResponse(
                content={"error": "No file uploaded."}, 
                status_code=400
            )

        # Optimize image size
        optimized_image = optimize_image_size(contents)
        image_b64 = base64.b64encode(optimized_image).decode()

        # Generate a unique cache key for the current image
        cache_key = generate_cache_key(image_b64)
        logger.info(f"Processing image with cache key: {cache_key}")

        # Get the threat analysis result
        result = get_threat_analysis(image_b64)

        if result is not None:
            if "dangerous" in result.lower():
                return JSONResponse(
                    content={
                        "alert": "dangerous", 
                        "description": result
                    }
                )
            return JSONResponse(content={"alert": "not dangerous"})

        return JSONResponse(
            content={"error": "No valid response from model."}, 
            status_code=500
        )

    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return JSONResponse(
            content={"error": f"Internal server error: {str(e)}"}, 
            status_code=500
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)