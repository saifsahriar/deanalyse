from fastapi import APIRouter, UploadFile, File, HTTPException
from services.data_service import DataService
from services.ai_service import AIService
import re
import os
import sys

# Add parent directory to path to import config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config.security import (
    MAX_FILE_SIZE_BYTES,
    ALLOWED_FILE_EXTENSIONS,
    MAX_FILENAME_LENGTH
)

router = APIRouter()
data_service = DataService()
ai_service = AIService()

# In-memory storage for simple context retention (replaced by DB in prod)
# Key: session_id or 'latest', Value: Summary Dict
DATA_CONTEXT = {}

def sanitize_filename(filename: str) -> str:
    """
    Sanitize filename to prevent path traversal and injection attacks.
    """
    # Remove path components
    filename = os.path.basename(filename)
    
    # Remove dangerous characters
    filename = re.sub(r'[^\w\s\-\.]', '', filename)
    
    # Limit length
    if len(filename) > MAX_FILENAME_LENGTH:
        name, ext = os.path.splitext(filename)
        filename = name[:MAX_FILENAME_LENGTH - len(ext)] + ext
    
    return filename

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Security: Sanitize filename
        safe_filename = sanitize_filename(file.filename or "upload.csv")
        
        # Security: Validate file type
        file_ext = '.' + safe_filename.split('.')[-1].lower() if '.' in safe_filename else ''
        if file_ext not in ALLOWED_FILE_EXTENSIONS:
            raise HTTPException(
                status_code=400, 
                detail=f"File type not allowed. Please upload CSV or Excel files only."
            )
        
        # Security: Limit file size
        content = await file.read()
        if len(content) > MAX_FILE_SIZE_BYTES:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Maximum size is {MAX_FILE_SIZE_BYTES // (1024*1024)}MB."
            )
        
        # Security: Validate content is not empty
        if len(content) == 0:
            raise HTTPException(status_code=400, detail="File is empty")
        
        # 1. Process File
        df = data_service.read_file(content, safe_filename)
        
        # 2. Generate Summary
        summary = data_service.get_summary(df)
        
        # 3. Detect Anomalies
        anomalies = data_service.detect_anomalies(df)
        summary['anomalies'] = anomalies
        
        # 4. Save Context (Simulated Session)
        DATA_CONTEXT['latest'] = summary
        
        # 5. Get AI KPI Suggestions
        # This is async, so we await it
        kpi_suggestions = await ai_service.suggest_kpis(summary)
        summary['ai_kpis'] = kpi_suggestions
        
        return {
            "message": "File processed successfully",
            "filename": safe_filename,
            "summary": summary
        }
        
    except HTTPException:
        raise  # Re-raise HTTP exceptions
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # Security: Don't expose internal errors
        print(f"Error processing file: {str(e)}")  # Log internally
        raise HTTPException(status_code=500, detail="An error occurred processing your file")

@router.get("/context")
def get_context():
    """Debug endpoint to see current stored context"""
    return DATA_CONTEXT.get('latest', {})
