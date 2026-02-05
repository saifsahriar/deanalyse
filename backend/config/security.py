"""
Security Configuration for DeAnalyse Application
This file contains all security-related constants and configurations.
"""

# File Upload Security
MAX_FILE_SIZE_MB = 10
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024
ALLOWED_FILE_EXTENSIONS = ['.csv', '.xlsx', '.xls']
ALLOWED_MIME_TYPES = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
]

# Input Validation
MAX_QUERY_LENGTH = 500
MAX_FILENAME_LENGTH = 255
MAX_CONTEXT_LENGTH = 5000

# Rate Limiting (requests per minute)
RATE_LIMIT_UPLOAD = 10
RATE_LIMIT_CHAT = 30

# LLM Security - Dangerous patterns to filter
PROMPT_INJECTION_PATTERNS = [
    "ignore previous instructions",
    "ignore all previous",
    "disregard previous",
    "forget previous",
    "new instructions:",
    "system:",
    "assistant:",
    "you are now",
    "act as",
    "pretend you are",
    "roleplay as",
    "bypass",
    "jailbreak",
]

# CORS Configuration
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

# Session Security
SESSION_TIMEOUT_MINUTES = 30
MAX_SESSIONS_PER_USER = 3

# Data Retention
MAX_DATA_RETENTION_HOURS = 24  # Auto-clear uploaded data after 24 hours
