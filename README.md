# AI-Enhanced EMR PoC

## Overview
This PoC demonstrates an AI-enhanced EMR interface:
- AI-generated clinical notes
- Inline suggestions
- Risk alerts
- FHIR/HL7 EMR integration

## Setup

### Backend
1. Create virtual environment: `python -m venv venv`
2. Activate: `source venv/bin/activate` (Mac/Linux) or `venv\Scripts\activate` (Windows)
3. Install dependencies: `pip install -r backend/requirements.txt`
4. Run: `uvicorn backend.main:app --reload`

### Frontend
1. Navigate to `frontend/`
2. Install dependencies: `npm install`
3. Run: `npm start`