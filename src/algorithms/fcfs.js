export function runFCFS(procs) {
    const result = [];
    const waitingTimes = {};
    const turnaroundTimes = {};
    const gantt = [];
    const sortedProcesses = [...procs].sort((a, b) => a.arrivalTime - b.arrivalTime);
    let currentTime = 0;
  
    sortedProcesses.forEach(process => {
      if (process.arrivalTime > currentTime) {
        gantt.push({ start: currentTime, end: process.arrivalTime, process: "Idle" });
        currentTime = process.arrivalTime;
      }
      waitingTimes[process.id] = currentTime - process.arrivalTime;
      gantt.push({
        start: currentTime,
        end: currentTime + process.burstTime,
        process: process.name,
        color: process.color
      });
      currentTime += process.burstTime;
      turnaroundTimes[process.id] = waitingTimes[process.id] + process.burstTime;
      result.push({
        id: process.id,
        name: process.name,
        arrivalTime: process.arrivalTime,
        burstTime: process.burstTime,
        waitingTime: waitingTimes[process.id],
        turnaroundTime: turnaroundTimes[process.id],
        completionTime: currentTime
      });
    });
  
    return {
      processDetails: result,
      averageWaitingTime: Object.values(waitingTimes).reduce((a, b) => a + b, 0) / procs.length,
      averageTurnaroundTime: Object.values(turnaroundTimes).reduce((a, b) => a + b, 0) / procs.length,
      gantt
    };
  }
  