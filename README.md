# DeAnalyse - AI Data Analyst

DeAnalyse is a full-stack AI-powered application that helps you analyze, visualize, and chat with your data. It combines a modern React frontend with a robust Python backend (FastAPI + Pandas + Gemini AI).

## Features
- **File Upload**: Support for CSV and Excel files.
- **Auto Analysis**: Pandas backend generates statistical summaries and detects anomalies.
- **Dynamic Dashboard**: Automatically generates relevant KPIs and charts (Bar, Line, Pie).
- **AI Chat**: Ask questions about your data using Google Gemini AI.
- **Authentication**: Supabase integration with Mock Mode fallback.

## Tech Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Recharts
- **Backend**: FastAPI, Pandas, Google Gemini, Uvicorn
- **Auth**: Supabase

## Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- Google Gemini API Key (optional, for AI features)

## Installation

### 1. Install Frontend Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
- Create `backend/.env` with `GEMINI_API_KEY=your_key_here` for AI features.
- Create `.env` in root with Supabase keys for real authentication.

## Quick Start (Recommended)
Use the included startup script to run both frontend and backend:

```bash
./start_app.sh
```

## Manual Start

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```
Backend runs on `http://localhost:8000`.

### Frontend
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`.
