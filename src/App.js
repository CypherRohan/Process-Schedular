import { useState } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';

import ProcessInput from './components/ProcessInput';
import GanttChart from './components/GanttChart';
import ResultTable from './components/ResultTable';
import ComparisonChart from './components/ComparisonChart';

import { runFCFS } from './algorithms/fcfs';
import { runSJF } from './algorithms/sjf';
import { runPriority } from './algorithms/priority';
import { runRoundRobin } from './algorithms/rr';
import { runSRTF } from './algorithms/srtf';
import { runPreemptivePriority } from './algorithms/preemptivePriority';

import { COLORS, algorithms } from './utils/constants';

export function CPUSchedulerSimulator() {
  const [processes, setProcesses] = useState([
    { id: 1, name: "P1", arrivalTime: 0, burstTime: 8, priority: 3, color: COLORS[0] },
    { id: 2, name: "P2", arrivalTime: 1, burstTime: 4, priority: 1, color: COLORS[1] },
    { id: 3, name: "P3", arrivalTime: 2, burstTime: 9, priority: 2, color: COLORS[2] },
    { id: 4, name: "P4", arrivalTime: 3, burstTime: 5, priority: 4, color: COLORS[3] }
  ]);

  const [quantum, setQuantum] = useState("2");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('all');
  const [chartMode, setChartMode] = useState('gantt');
  const [results, setResults] = useState({});
  const [ganttData, setGanttData] = useState({});

  const addProcess = () => {
    const nextId = processes.length ? Math.max(...processes.map(p => p.id)) + 1 : 1;
    setProcesses([...processes, {
      id: nextId,
      name: `P${nextId}`,
      arrivalTime: 0,
      burstTime: 5,
      priority: 1,
      color: COLORS[processes.length % COLORS.length]
    }]);
  };

  const removeProcess = (id) => setProcesses(processes.filter(p => p.id !== id));

  const handleProcessChange = (id, field, value) => {
    setProcesses(processes.map(p =>
      p.id === id ? { ...p, [field]: field === 'name' ? value : parseInt(value) || 0 } : p
    ));
  };

  const runSimulation = () => {
    const processData = [...processes];
    const allResults = {};
    const allGanttData = {};

    allResults.fcfs = runFCFS(processData);
    allGanttData.fcfs = allResults.fcfs.gantt;

    allResults.sjf = runSJF(processData);
    allGanttData.sjf = allResults.sjf.gantt;

    allResults.priority = runPriority(processData);
    allGanttData.priority = allResults.priority.gantt;

    allResults.rr = runRoundRobin(processData, quantum ? parseInt(quantum) : undefined);
    allGanttData.rr = allResults.rr.gantt;

    allResults.srtf = runSRTF(processData);
    allGanttData.srtf = allResults.srtf.gantt;

    allResults.preemptivePriority = runPreemptivePriority(processData);
    allGanttData.preemptivePriority = allResults.preemptivePriority.gantt;

    setResults(allResults);
    setGanttData(allGanttData);
  };

  const getComparisonChartData = () => {
    if (Object.keys(results).length === 0) return [];
    return [
      {
        name: "Avg. Waiting Time",
        fcfs: results.fcfs?.averageWaitingTime ?? 0,
        sjf: results.sjf?.averageWaitingTime ?? 0,
        priority: results.priority?.averageWaitingTime ?? 0,
        rr: results.rr?.averageWaitingTime ?? 0,
        srtf: results.srtf?.averageWaitingTime ?? 0,
        preemptivePriority: results.preemptivePriority?.averageWaitingTime ?? 0,
      },
      {
        name: "Avg. Turnaround Time",
        fcfs: results.fcfs?.averageTurnaroundTime ?? 0,
        sjf: results.sjf?.averageTurnaroundTime ?? 0,
        priority: results.priority?.averageTurnaroundTime ?? 0,
        rr: results.rr?.averageTurnaroundTime ?? 0,
        srtf: results.srtf?.averageTurnaroundTime ?? 0,
        preemptivePriority: results.preemptivePriority?.averageTurnaroundTime ?? 0,
      }
    ];
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">CPU Scheduling Simulator</h1>

      <ProcessInput
        processes={processes}
        handleProcessChange={handleProcessChange}
        removeProcess={removeProcess}
        addProcess={addProcess}
      />

      <div className="bg-white rounded shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">Algorithm & Chart</h2>
        <div className="flex flex-wrap gap-4 items-center mb-2">
          <select value={selectedAlgorithm} onChange={e => setSelectedAlgorithm(e.target.value)} className="border rounded p-2">
            {algorithms.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <br></br><br></br>
          <label id="rr">Enter Time Quantum for Round-robin</label>
          <input type="number" min="1" value={quantum} onChange={e => setQuantum(e.target.value)} className="border rounded p-2 w-24" disabled={selectedAlgorithm !== 'rr'} placeholder="Time quantum for RR)" />
          <br></br><br></br>
          <button onClick={() => setChartMode('gantt')} className={`scheduler-action-btn px-3 py-1 rounded ${chartMode === 'gantt' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Gantt Chart</button>
          <button onClick={() => setChartMode('line')} className={`scheduler-action-btn px-3 py-1 rounded ${chartMode === 'line' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Line Chart</button>
          <button onClick={runSimulation} className="scheduler-action-btn bg-blue-600 text-white px-4 py-1 rounded">Run Simulation</button>
        </div>
      </div>

      {Object.keys(results).length > 0 && (
        <div className="bg-white rounded shadow p-4 mb-6">
          <h2 className="text-lg font-semibold mb-2">Results</h2>
          {selectedAlgorithm === 'all' ? (
            <>
              {chartMode === 'line' && <ComparisonChart chartData={getComparisonChartData()} />}
              {chartMode === 'gantt' && (
                <div className="flex flex-row flex-wrap gap-8">
                  {['fcfs', 'sjf', 'priority', 'rr', 'srtf', 'preemptivePriority'].map(algo => (
                    <div key={algo} className="flex-1 min-w-[340px]">
                      <h3 className="font-semibold mb-1">{algorithms.find(a => a.id === algo).name}</h3>
                      <GanttChart data={ganttData[algo]} />
                      <ResultTable algorithmResult={results[algo]} />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <h3 className="font-semibold mb-1">{algorithms.find(a => a.id === selectedAlgorithm)?.name}</h3>
              {chartMode === 'gantt' && <GanttChart data={ganttData[selectedAlgorithm]} />}
              <ResultTable algorithmResult={results[selectedAlgorithm]} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/simulator" element={<CPUSchedulerSimulator />} />
    </Routes>
  );
}
