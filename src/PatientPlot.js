import Plot from "react-plotly.js";

function PatientPlot({ patient }) {
  const fi = patient.fi_lab;

  const inpatient = patient.inpatient_visits ?? [];
  const ed = patient.ed_visits ?? [];
  const dx = patient.dx_annotations ?? [];
  const deathDate = patient.death?.date ?? null;

  return (
    <Plot
      data={[
        // FI Acute
        {
          x: fi.dates,
          y: fi.acute,
          mode: "markers",
          name: "FI Lab Acute",
          marker: { size: 6 }
        },

        // FI Chronic
        {
          x: fi.dates,
          y: fi.chronic,
          mode: "lines",
          name: "FI Lab Chronic",
          line: { width: 3 }
        },

        // 🟣 DX markers
        {
          x: dx.map(d => d.date),
          y: dx.map(() => 0.02),
          mode: "markers",
          name: "Diagnosis",
          marker: {
            symbol: "triangle-up",
            size: 10,
            color: "purple"
          },
          hovertemplate: "%{x}<br>%{text}<extra></extra>",
          text: dx.map(d => d.text)
        }
      ]}
      layout={{
        title: `FI-Lab Timeline — HCN ${patient.hcn}`,
        yaxis: { range: [0, 1] },
        hovermode: "x unified",
        height: 480,

        shapes: [
          // 🟥 Inpatient
          ...inpatient.map(v => ({
            type: "rect",
            xref: "x",
            yref: "paper",
            x0: v.start,
            x1: v.end,
            y0: 0,
            y1: 1,
            fillcolor: "salmon",
            opacity: 0.25,
            line: { width: 0 }
          })),

          // 🟦 ED
          ...ed.map(v => ({
            type: "rect",
            xref: "x",
            yref: "paper",
            x0: v.start,
            x1: v.end,
            y0: 0,
            y1: 1,
            fillcolor: "skyblue",
            opacity: 0.35,
            line: { width: 0 }
          })),

          // ☠ Death
          deathDate && {
            type: "line",
            x0: deathDate,
            x1: deathDate,
            yref: "paper",
            y0: 0,
            y1: 1,
            line: {
              color: "red",
              dash: "dash",
              width: 3
            }
          }
        ].filter(Boolean),

        annotations: [
          // ☠ Death label
          deathDate && {
            x: deathDate,
            y: 1,
            yref: "paper",
            text: "Death",
            showarrow: false,
            font: { color: "red", size: 12 },
            yanchor: "bottom"
          }
        ].filter(Boolean)
      }}
      style={{ width: "100%" }}
    />
  );
}

export default PatientPlot;
