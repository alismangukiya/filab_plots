import { useState } from "react";
import patients from "./data/fi_lab_all_patients.json";
import PatientPlot from "./PatientPlot";
import "./App.css";

const PASSWORD = "redcow";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(patients[0]);

  const handleLogin = () => {
    if (password === PASSWORD) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("❌ Incorrect password");
    }
  };

  // 🔒 PASSWORD SCREEN
  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <h2>🔒 Enter password 🔒 </h2>

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />

        <button onClick={handleLogin}>Unlock</button>

        {error && <div className="error">{error}</div>}
      </div>
    );
  }

  // ✅ MAIN APP
  return (
    <div className="app">
      {/* LEFT SIDEBAR */}
      <aside className="sidebar">
        <h3 className="sidebar-title">Patients</h3>

        <div className="patient-list">
          {patients.map((p) => (
            <div
              key={p.hcn}
              className={`patient-item ${
                selectedPatient?.hcn === p.hcn ? "active" : ""
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
