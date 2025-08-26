import React, { useState } from "react";
import axios from "axios";

function App() {
  const [patientId, setPatientId] = useState("");
  const [patient, setPatient] = useState(null);
  const [rawNote, setRawNote] = useState("");
  const [aiNote, setAiNote] = useState("");
  const [alerts, setAlerts] = useState([]);

  const fetchPatient = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/patients/${patientId}`);
      setPatient(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const generateAndSyncNote = async () => {
    try {
      const res = await axios.post(`http://localhost:8000/ai-note-sync`, {
        patient_id: patientId,
        raw_text: rawNote
      });
      setAiNote(res.data.ai_note);

      const newAlerts = [];
      if (res.data.ai_note.includes("high risk")) newAlerts.push("⚠️ Patient at high risk of readmission!");
      setAlerts(newAlerts);

      alert(res.data.sync_status === "success" ? "Note synced to EMR!" : "Sync failed");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">AI-Enhanced EMR PoC</h1>

      <div className="mb-6 flex gap-2">
        <input
          className="border p-2 rounded flex-1"
          placeholder="Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
        />
        <button className="bg-blue-500 text-white p-2 rounded" onClick={fetchPatient}>
          Fetch Patient
        </button>
      </div>

      {patient && (
        <div className="border p-4 rounded shadow bg-white mb-6">
          <h2 className="text-xl font-semibold mb-2">Patient Summary</h2>
          <p><strong>Name:</strong> {patient.name}</p>
          <p><strong>Gender:</strong> {patient.gender}</p>
          <p><strong>Birth Date:</strong> {patient.birthDate}</p>
        </div>
      )}

      <div className="mb-4">
        <textarea
          className="border w-full p-2 rounded"
          rows={5}
          placeholder="Enter raw clinical note..."
          value={rawNote}
          onChange={(e) => setRawNote(e.target.value)}
        />
      </div>

      {aiNote && (
        <div className="mb-6 p-4 rounded shadow bg-white">
          <h2 className="text-lg font-semibold mb-2">AI-Enhanced Note</h2>
          <textarea
            className="border w-full p-2 rounded bg-gray-50"
            rows={5}
            value={aiNote}
            onChange={(e) => setAiNote(e.target.value)}
          />

          {alerts.length > 0 && (
            <div className="mt-4 p-3 border-l-4 border-red-500 bg-red-100 rounded">
              {alerts.map((alert, idx) => (
                <p key={idx} className="font-medium text-red-700">{alert}</p>
              ))}
            </div>
          )}

          <button
            className="bg-purple-500 text-white p-2 rounded mt-4"
            onClick={generateAndSyncNote}
          >
            Save & Sync to EMR
          </button>
        </div>
      )}
    </div>
  );
}

export default App;