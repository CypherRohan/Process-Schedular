export function runSJF(procs) {
    const result = [];
    const waitingTimes = {};
    const turnaroundTimes = {};
    const gantt = [];
    const processes = [...procs].map(p => ({ ...p }));
    let currentTime = 0;
    let completed = 0;
  
    while (completed < processes.length) {
      let shortestIndex = -1;
      let shortestBurst = Infinity;
      let allArrived = false;
      for (let i = 0; i < processes.length; i++) {
        if (processes[i].completed) continue;
        if (processes[i].arrivalTime <= currentTime) {
          allArrived = true;
          if (processes[i].burstTime < shortestBurst) {
            shortestBurst = processes[i].burstTime;
            shortestIndex = i;
          }
        }
      }
      if (!allArrived) {
        let nextArrival = Math.min(...processes.filter(p => !p.completed).map(p => p.arrivalTime));
        gantt.push({ start: currentTime, end: nextArrival, process: "Idle" });
        currentTime = nextArrival;
        continue;
      }
      const process = processes[shortestIndex];
      waitingTimes[process.id] = currentTime - process.arrivalTime;
      gantt.push({
        start: currentTime,
        end: currentTime + process.burstTime,
        process: process.name,
        color: process.color
      });
      currentTime += process.burstTime;
      turnaroundTimes[process.id] = waitingTimes[process.id] + process.burstTime;
      process.completed = true;
      completed++;
      result.push({
        id: process.id,
        name: process.name,
        arrivalTime: process.arrivalTime,
        burstTime: process.burstTime,
        waitingTime: waitingTimes[process.id],
        turnaroundTime: turnaroundTimes[process.id],
        completionTime: currentTime
      });
    }
  
    return {
      processDetails: result,
      averageWaitingTime: Object.values(waitingTimes).reduce((a, b) => a + b, 0) / procs.length,
      averageTurnaroundTime: Object.values(turnaroundTimes).reduce((a, b) => a + b, 0) / procs.length,
      gantt
    };
  }
  