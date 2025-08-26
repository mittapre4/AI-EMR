from fastapi import FastAPI
from pydantic import BaseModel
import openai
from dotenv import load_dotenv
import os
from utils import get_fhir_client
from fhirclient.models import documentreference as dr
from fhirclient.models import fhirdate

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

smart = get_fhir_client()
app = FastAPI(title="AI-Enhanced EMR PoC")

class NoteInput(BaseModel):
    patient_id: str
    raw_text: str

@app.get("/patients/{patient_id}")
def get_patient(patient_id: str):
    # Dummy patient for PoC
    return {
        "id": patient_id,
        "name": "John Doe",
        "gender": "male",
        "birthDate": "1980-01-01"
    }

@app.post("/ai-note-sync")
def generate_and_sync_note(note_input: NoteInput):
    """Generate AI note and sync back to EMR"""
    prompt = f"Rewrite this clinical note clearly and concisely:\n{note_input.raw_text}"
    
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=prompt,
        max_tokens=250
    )
    ai_note = response.choices[0].text.strip()

    try:
        doc_ref = dr.DocumentReference()
        doc_ref.status = "current"
        doc_ref.type = {"text": "AI-generated clinical note"}
        doc_ref.subject = {"reference": f"Patient/{note_input.patient_id}"}
        doc_ref.date = fhirdate.FHIRDate.now()
        doc_ref.content = [{"attachment": {"contentType": "text/plain", "data": ai_note.encode("utf-8").hex()}}]
        doc_ref.create(smart.server)
        return {"ai_note": ai_note, "sync_status": "success"}
    except Exception as e:
        return {"ai_note": ai_note, "sync_status": "failed", "error": str(e)}
