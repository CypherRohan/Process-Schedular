import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function ComparisonChart({ chartData }) {
  if (chartData.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-2">Algorithm Comparison (Line Chart)</h3>
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="fcfs" name="FCFS" stroke="#FF6384" />
            <Line type="monotone" dataKey="sjf" name="SJF" stroke="#36A2EB" />
            <Line type="monotone" dataKey="priority" name="Priority" stroke="#FFCE56" />
            <Line type="monotone" dataKey="rr" name="Round Robin" stroke="#4BC0C0" />
            <Line type="monotone" dataKey="srtf" name="SRTF" stroke="#9966FF" />
            <Line type="monotone" dataKey="preemptivePriority" name="P-Priority" stroke="#FF9F40" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
