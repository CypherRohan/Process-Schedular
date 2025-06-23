import React from 'react';

export default function ProcessInput({ processes, handleProcessChange, removeProcess, addProcess }) {
  return (
    <div className="bg-white rounded shadow p-4 mb-6">
      <h2 className="text-lg font-semibold mb-2">Processes</h2>
      <table className="min-w-full border mb-2">
        <thead>
          <tr className="bg-gray-100">
            <th>Name</th>
            <th>Arrival</th>
            <th>Burst</th>
            <th>Priority</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {processes.map(p => (
            <tr key={p.id}>
              <td><input type="text" value={p.name} onChange={e => handleProcessChange(p.id, 'name', e.target.value)} className="border rounded px-1 w-16" /></td>
              <td><input type="number" min="0" value={p.arrivalTime} onChange={e => handleProcessChange(p.id, 'arrivalTime', e.target.value)} className="border rounded px-1 w-16" /></td>
              <td><input type="number" min="1" value={p.burstTime} onChange={e => handleProcessChange(p.id, 'burstTime', e.target.value)} className="border rounded px-1 w-16" /></td>
              <td><input type="number" min="1" value={p.priority} onChange={e => handleProcessChange(p.id, 'priority', e.target.value)} className="border rounded px-1 w-16" /></td>
              <td><button onClick={() => removeProcess(p.id)} className="bg-red-500 text-white px-2 rounded">X</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div id='d_process_btn' className="flex w-full justify-center mt-4">
        <button id='add-process-btn' onClick={addProcess} className="scheduler-action-btn bg-blue-600 text-white px-4 py-1 rounded">Add Process</button>
      </div>
    </div>
  );
}
