import patients from "./data/fi_lab_all_patients.json";
import PatientPlot from "./PatientPlot";

function App() {
  return (
    <div style={{ padding: 20 }}>
      {patients.map((patient) => (
        <div key={patient.hcn} style={{ marginBottom: 80 }}>
          <PatientPlot patient={patient} />
        </div>
      ))}
    </div>
  );
}

export default App;
