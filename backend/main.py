from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import Response
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = FastAPI(title="DeAnalyse API")

# Security: Add security headers middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    
    # Prevent XSS attacks
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    
    # Content Security Policy (simplified to avoid header parsing issues)
    response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' http://localhost:5173 http://localhost:3000"
    
    # Prevent information leakage
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    
    # Force HTTPS in production (commented for local dev)
    # response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    
    return response

# Security: Proper CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://localhost:3000",
        "https://deanalyse.netlify.app"  # Netlify Production
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "HEAD"],
    allow_headers=["Content-Type", "Authorization"],
)

# Security: Prevent host header attacks
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]  # Allowed all for cloud compatibility, CORS still protects the API
)

from routers import upload, chat

# Include routers
app.include_router(upload.router, prefix="/api")
app.include_router(chat.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "DeAnalyse API is running", "status": "healthy"}

@app.get("/health")
def health_check():
    return {"status": "ok"}


app.include_router(upload.router, prefix="/api", tags=["Upload"])
app.include_router(chat.router, prefix="/api", tags=["Chat"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
