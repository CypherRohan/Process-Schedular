import React from 'react';

export default function LandingAlgorithms() {
  return (
    <div className="landing-info-section" id="algorithms">
      <h2>Supported Scheduling Algorithms</h2>
      <ul>
        <li><b>FCFS (First-Come, First-Served):</b> Simple, non-preemptive. Best for batch systems.</li>
        <li><b>SJF (Shortest Job First):</b> Non-preemptive, optimal for minimizing waiting time, but can cause starvation.</li>
        <li><b>Priority Scheduling:</b> Assigns priority to each process. Good for real-time systems.</li>
        <li><b>Round Robin:</b> Preemptive, time-sliced. Ideal for time-sharing systems.</li>
        <li><b>SRTF (Shortest Remaining Time First):</b> Preemptive SJF variant, best for minimizing turnaround time.</li>
        <li><b>Preemptive Priority:</b> Preemptive version of priority scheduling, suitable for real-time needs.</li>
      </ul>
    </div>
  );
} 