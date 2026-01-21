import Plot from "react-plotly.js";

function PatientPlot({ patient }) {
  return (
    <Plot
      data={[
        {
          x: patient.dates,
          y: patient.acute,
          mode: "markers",
          name: "FI Lab Acute"
        },
        {
          x: patient.dates,
          y: patient.chronic,
          mode: "lines",
          name: "FI Lab Chronic",
          line: { width: 3 }
        }
      ]}
      layout={{
        title: `FI-Lab Timeline — HCN ${patient.hcn}`,
        yaxis: { range: [0, 1] },
        hovermode: "x unified",
        shapes: [
          // Inpatient
          ...patient.inpatient.map(v => ({
            type: "rect",
            xref: "x",
            yref: "paper",
            x0: v.start,
            x1: v.end,
            y0: 0,
            y1: 1,
            fillcolor: "salmon",
            opacity: 0.2,
            line: { width: 0 }
          })),
          // ED
          ...patient.ed.map(v => ({
            type: "rect",
            xref: "x",
            yref: "paper",
            x0: v.start,
            x1: v.end,
            y0: 0,
            y1: 1,
            fillcolor: "skyblue",
            opacity: 0.4,
            line: { width: 0 }
          })),
          // Death
          patient.death_date && {
            type: "line",
            x0: patient.death_date,
            x1: patient.death_date,
            yref: "paper",
            y0: 0,
            y1: 1,
            line: { color: "red", dash: "dash", width: 2 }
          }
        ].filter(Boolean)
      }}
      style={{ width: "100%" }}
    />
  );
}

export default PatientPlot;
