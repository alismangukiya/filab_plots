import Plot from "react-plotly.js";

function PatientPlot({ patient }) {
  const fi = patient.fi_lab;

  const inpatient = patient.inpatient_visits ?? [];
  const ed = patient.ed_visits ?? [];
  const dx = patient.dx_annotations ?? [];
  const deathDate = patient.death?.date ?? null;

  const lastDischarge =
    patient.last_discharge && !patient.last_discharge.death_from_dad
      ? patient.last_discharge
      : null;


  return (
    <Plot
      data={[
        // FI Acute
        {
          x: fi.dates,
          y: fi.acute,
          mode: "lines+markers",
          name: "FI Lab Acute",
          marker: { size: 1 },
          line: { width: 2 }
        },

        // FI Chronic
        {
          x: fi.dates,
          y: fi.chronic,
          mode: "markers+lines",
          connectgaps: true,
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

          // 🟢 Last discharge (NON-death only)
          lastDischarge && {
            type: "line",
            xref: "x",
            yref: "paper",
            x0: lastDischarge.date,
            x1: lastDischarge.date,
            y0: 0,
            y1: 1,
            line: {
              color: "black",
              dash: "dot",
              width: 2
            }
          },

          // ☠ Death (unchanged)
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
          {
            x: 0,
            y: 1.14,
            xref: "paper",
            yref: "paper",
            text: `Age: ${patient.age}  •  Sex: ${patient.sex}`,
            showarrow: false,
            align: "left",
            font: {
              size: 20,
              color: "#222"
            }
          },

          lastDischarge && {
            x: lastDischarge.date,
            y: 1,
            yref: "paper",
            text: `Last Discharge: ${lastDischarge.disposition}`,
            showarrow: false,
            font: { color: "black", size: 11 },
            bgcolor: "rgba(255,255,255,0.85)",
            bordercolor: "black",
            borderwidth: 1,
            yanchor: "bottom"
          },

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
      config={{
        scrollZoom: false,
        modeBarButtonsToRemove: [
          "zoom2d",
          "zoomIn2d",
          "zoomOut2d",
          "pan2d",
          "select2d",
          "lasso2d",
          "autoScale2d",
          "resetScale2d"
        ],
        displaylogo: false,
        displayModeBar: true,
        staticPlot: false
      }}
      style={{ width: "100%" }}
    />
  );
}

export default PatientPlot;
