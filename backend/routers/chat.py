from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field, validator
from services.ai_service import AIService
from routers.upload import DATA_CONTEXT

router = APIRouter()
ai_service = AIService()

class ChatRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=500)
    
    @validator('query')
    def validate_query(cls, v):
        # Security: Prevent injection attacks
        if not v or not v.strip():
            raise ValueError('Query cannot be empty')
        # Remove any potentially dangerous characters
        v = v.strip()
        return v

@router.post("/chat")
async def chat(request: ChatRequest):
    try:
        context_data = DATA_CONTEXT.get('latest')
        
        if not context_data:
            return {
                "response": "I don't have any data loaded yet. Please upload a file first so I can analyze it."
            }
            
        # Create a string representation of the context
        context_str = str(context_data)
        
        response = await ai_service.generate_response(context_str, request.query)
        
        return {
            "response": response
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # Security: Don't expose internal errors
        raise HTTPException(status_code=500, detail="An error occurred processing your request")
