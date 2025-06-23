import React from 'react';

export default function ResultTable({ algorithmResult }) {
  if (!algorithmResult || !algorithmResult.processDetails) return null;

  return (
    <div className="overflow-x-auto mt-2">
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th>Process</th>
            <th>Arrival</th>
            <th>Burst</th>
            {algorithmResult.processDetails[0].priority !== undefined && <th>Priority</th>}
            <th>Completion</th>
            <th>Turnaround</th>
            <th>Waiting</th>
          </tr>
        </thead>
        <tbody>
          {algorithmResult.processDetails.map(proc => (
            <tr key={proc.id}>
              <td>{proc.name}</td>
              <td>{proc.arrivalTime}</td>
              <td>{proc.burstTime}</td>
              {proc.priority !== undefined && <td>{proc.priority}</td>}
              <td>{proc.completionTime}</td>
              <td>{proc.turnaroundTime}</td>
              <td>{proc.waitingTime}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={algorithmResult.processDetails[0].priority !== undefined ? 7 : 6}>
              Avg Waiting: <b>{algorithmResult.averageWaitingTime.toFixed(2)}</b> &nbsp; | &nbsp;
              Avg Turnaround: <b>{algorithmResult.averageTurnaroundTime.toFixed(2)}</b>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
