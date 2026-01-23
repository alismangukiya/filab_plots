import { useState } from "react";
import patients from "./data/fi_lab_all_patients.json";
import PatientPlot from "./PatientPlot";
import "./App.css";

function App() {
  const [selectedPatient, setSelectedPatient] = useState(patients[0]);

  return (
    <div className="app">
      {/* LEFT SIDEBAR */}
      <aside className="sidebar">
        <h3 className="sidebar-title">Patients</h3>

        <div className="patient-list">
          {patients.map((p) => (
            <div
              key={p.hcn}
              className={`patient-item ${selectedPatient?.hcn === p.hcn ? "active" : ""
                }`}
              onClick={() => setSelectedPatient(p)}
            >
              <div className="patient-hcn">HCN {p.hcn}</div>

              {p.death?.date && (
                <div className="patient-death">☠ Deceased</div>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* RIGHT CONTENT */}
      <main className="content">
        {selectedPatient ? (
          <div className="plot-card">
            <PatientPlot patient={selectedPatient} />
          </div>
        ) : (
          <div className="empty">Select a patient</div>
        )}
      </main>

    </div>
  );
}

export default App;
