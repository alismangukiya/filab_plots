import Plot from "react-plotly.js";
import { useEffect, useRef, useState } from "react";

/**
 * ResizeObserver hook
 * Forces Plotly to re-measure container width
 */
function useResizeObserver() {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, size];
}

function PatientPlot({ patient }) {
  const [containerRef, size] = useResizeObserver();

  const fi = patient.fi_lab;

  const inpatient = patient.inpatient_visits ?? [];
  const ed = patient.ed_visits ?? [];
  const dx = patient.dx_annotations ?? [];
  const deathDate = patient.death?.date ?? null;


  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "480px"
      }}
    >
      {size.width > 0 && (
        <Plot
          key={size.width}   // force resize
          data={[
            // ---------------- FI ACUTE ----------------
            {
              x: fi.dates,
              y: fi.acute,
              mode: "markers",
              name: "FI Lab Acute",
              marker: { size: 5 },
              // 👇 SHOW TEST COUNT
              text: fi.num_of_tests,
              hovertemplate:
                "FI Acute: %{y:.3f}<br>" +
                "# of Unique tests: %{text}<extra></extra>"
            },

            // ---------------- FI CHRONIC ----------------
            {
              x: fi.dates,
              y: fi.chronic,
              mode: "lines+markers",
              connectgaps: true,
              name: "FI Lab Chronic",
              line: { width: 3 },
              text: fi.num_of_tests,
              hovertemplate:
                "FI Chronic: %{y:.3f}<br>" +
                "# of Unique tests: %{text}<extra></extra>"
            },

            // ---------------- DX MARKERS ----------------
            {
              x: inpatient.map(v => v.start),
              y: inpatient.map(() => 0.005),
              mode: "markers",
              name: "Diagnosis (MRDx)",
              marker: {
                symbol: "triangle-up",
                size: 10,
                color: "purple"
              },
              text: dx.map(d => d.text),
              hovertemplate:
                "Date: %{x|%Y-%m-%d}<br>" +
                "%{text}<extra></extra>"

            },

            // ---------------- DISCHARGE DISPOSITION (HOVER ONLY) ----------------
            {
              x: inpatient.map(v => v.end),
              y: inpatient.map(() => 0.005),   // same baseline as DX
              mode: "markers",
              name: "Discharge",
              marker: {
                size: 5,
                symbol: "x",
                color: "red" // invisible
              },
              text: inpatient.map(
                v => `Discharge: ${v.discharge_disposition ?? "Unknown"}`
              ),
              hovertemplate:
                "Date: %{x|%Y-%m-%d}<br>" +
                "%{text}<extra></extra>",
              showlegend: true
            },


            // ---------------- LEGEND: INPATIENT ----------------
            {
              x: [null],
              y: [null],
              mode: "markers",
              name: "Inpatient Stay",
              marker: {
                size: 12,
                color: "salmon",
                opacity: 0.4,
                symbol: "square"
              },
              showlegend: true,
              hoverinfo: "skip"
            },

            // ---------------- LEGEND: ED ----------------
            {
              x: [null],
              y: [null],
              mode: "markers",
              name: "Emergency Visit",
              marker: {
                size: 12,
                color: "skyblue",
                opacity: 0.5,
                symbol: "square"
              },
              showlegend: true,
              hoverinfo: "skip"
            },

          ]}
          layout={{
            autosize: true,
            title: `FI-Lab Timeline — HCN ${patient.hcn}`,
            hovermode: "x unified",

            yaxis: {
              title: "Frailty Index",
              range: [0, 0.8],
              fixedrange: true,
              dtick: 0.2,
              tick0: 0
            },

            xaxis: {
              fixedrange: false
            },

            shapes: [
              // Inpatient stays
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

              // ED visits
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

              // Death
              deathDate && {
                type: "line",
                xref: "x",
                yref: "paper",
                x0: deathDate,
                x1: deathDate,
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
                text: `Age: ${patient.age} • Sex: ${patient.sex}`,
                showarrow: false,
                align: "left",
                font: { size: 18, color: "#222" }
              },

              deathDate && {
                x: deathDate,
                y: 1,
                yref: "paper",
                text: "Death",
                showarrow: false,
                font: { size: 12, color: "red" },
                yanchor: "bottom"
              }
            ].filter(Boolean)
          }}
          config={{
            responsive: true,
            displaylogo: false,
            scrollZoom: true, modeBarButtonsToAdd: [
              {
                name: "↺ Reset",
                title: "Reset axes",
                icon: {
                  width: 16,
                  height: 16,
                  path: `
                      M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z
                      M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384
                      L8.41 4.658A.25.25 0 0 1 8 4.466
                  `,
                },
                click: (gd) => {
                  window.Plotly.relayout(gd, {
                    "xaxis.autorange": true,
                    "yaxis.range": [0, 0.8]
                  });
                }
              }
            ],
            modeBarButtonsToRemove: [
              "zoom2d",
              "zoomIn2d",
              "zoomOut2d",
              "pan2d",
              "select2d",
              "lasso2d",
              "autoScale2d",
              "toImage",
              "resetScale2d"
            ]
          }}
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </div>
  );
}

export default PatientPlot;
