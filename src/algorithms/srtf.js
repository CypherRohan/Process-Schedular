export function runSRTF(procs) {
    const result = [];
    const waitingTimes = {};
    const turnaroundTimes = {};
    const gantt = [];
    const processes = [...procs].map(p => ({
      ...p,
      remainingTime: p.burstTime,
      completed: false,
      startTime: -1,
      finishTime: -1
    }));
    let currentTime = 0;
    let completed = 0;
    let lastProcess = null;
  
    while (completed < processes.length) {
      let shortestIndex = -1;
      let shortestRemaining = Infinity;
      for (let i = 0; i < processes.length; i++) {
        if (!processes[i].completed && processes[i].arrivalTime <= currentTime) {
          if (processes[i].remainingTime < shortestRemaining) {
            shortestRemaining = processes[i].remainingTime;
            shortestIndex = i;
          }
        }
      }
      if (shortestIndex === -1) {
        let nextArrival = Math.min(...processes.filter(p => !p.completed).map(p => p.arrivalTime));
        if (lastProcess !== "Idle") {
          gantt.push({ start: currentTime, end: nextArrival, process: "Idle" });
          lastProcess = "Idle";
        } else if (gantt.length > 0) {
          gantt[gantt.length - 1].end = nextArrival;
        }
        currentTime = nextArrival;
        continue;
      }
      if (processes[shortestIndex].startTime === -1) {
        processes[shortestIndex].startTime = currentTime;
      }
      if (lastProcess !== processes[shortestIndex].name) {
        gantt.push({
          start: currentTime,
          end: currentTime + 1,
          process: processes[shortestIndex].name,
          color: processes[shortestIndex].color
        });
        lastProcess = processes[shortestIndex].name;
      } else {
        gantt[gantt.length - 1].end = currentTime + 1;
      }
      processes[shortestIndex].remainingTime--;
      currentTime++;
      if (processes[shortestIndex].remainingTime === 0) {
        processes[shortestIndex].completed = true;
        processes[shortestIndex].finishTime = currentTime;
        completed++;
        turnaroundTimes[processes[shortestIndex].id] = processes[shortestIndex].finishTime - processes[shortestIndex].arrivalTime;
        waitingTimes[processes[shortestIndex].id] = turnaroundTimes[processes[shortestIndex].id] - processes[shortestIndex].burstTime;
      }
    }
    const mergedGantt = [];
    let currentBlock = null;
    for (const block of gantt) {
      if (!currentBlock || currentBlock.process !== block.process) {
        currentBlock = { ...block };
        mergedGantt.push(currentBlock);
      } else {
        currentBlock.end = block.end;
      }
    }
    processes.forEach(process => {
      result.push({
        id: process.id,
        name: process.name,
        arrivalTime: process.arrivalTime,
        burstTime: process.burstTime,
        waitingTime: waitingTimes[process.id],
        turnaroundTime: turnaroundTimes[process.id],
        completionTime: process.finishTime
      });
    });
    return {
      processDetails: result,
      averageWaitingTime: Object.values(waitingTimes).reduce((a, b) => a + b, 0) / procs.length,
      averageTurnaroundTime: Object.values(turnaroundTimes).reduce((a, b) => a + b, 0) / procs.length,
      gantt: mergedGantt
    };
  }
  