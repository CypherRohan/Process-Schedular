import React from 'react';

export default function GanttChart({ data }) {
  if (!data || data.length === 0) return <div className="text-gray-500">No data to display</div>;

  const maxTime = Math.max(...data.map(item => item.end));
  const pxPerUnit = 40; // Each time unit gets 40px for clarity
  const chartWidth = (maxTime + 1) * pxPerUnit;

  return (
    <div className="gantt-scroll-container">
      <div style={{ position: "relative", width: chartWidth, height: 60, border: "1px solid #ddd", background: "#f9f9f9", borderRadius: 8, margin: "1rem 0" }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 20, display: "flex" }}>
          {Array.from({ length: maxTime + 1 }).map((_, i) => (
            <div key={i} style={{ width: pxPerUnit, textAlign: "center", fontSize: 12, color: "#888" }}>{i}</div>
          ))}
        </div>
        <div style={{ position: "absolute", top: 25, left: 0, height: 30, width: "100%" }}>
          {data.map((item, idx) => (
            <div
              key={idx}
              style={{
                position: "absolute",
                left: item.start * pxPerUnit,
                width: (item.end - item.start) * pxPerUnit,
                height: 30,
                background: item.process === "Idle" ? "#bbb" : (item.color || "#36A2EB"),
                color: "#fff",
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                boxShadow: "0 1px 2px rgba(0,0,0,0.08)"
              }}
              title={`${item.process}: ${item.start} - ${item.end}`}
            >
              {item.process} ({item.start}-{item.end})
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
