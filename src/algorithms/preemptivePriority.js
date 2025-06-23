export function runPreemptivePriority(procs) {
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
      let highestPriorityIndex = -1;
      let highestPriority = Infinity;
      for (let i = 0; i < processes.length; i++) {
        if (!processes[i].completed && processes[i].arrivalTime <= currentTime) {
          if (processes[i].priority < highestPriority) {
            highestPriority = processes[i].priority;
            highestPriorityIndex = i;
          }
        }
      }
      if (highestPriorityIndex === -1) {
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
      if (processes[highestPriorityIndex].startTime === -1) {
        processes[highestPriorityIndex].startTime = currentTime;
      }
      if (lastProcess !== processes[highestPriorityIndex].name) {
        gantt.push({
          start: currentTime,
          end: currentTime + 1,
          process: processes[highestPriorityIndex].name,
          color: processes[highestPriorityIndex].color
        });
        lastProcess = processes[highestPriorityIndex].name;
      } else {
        gantt[gantt.length - 1].end = currentTime + 1;
      }
      processes[highestPriorityIndex].remainingTime--;
      currentTime++;
      if (processes[highestPriorityIndex].remainingTime === 0) {
        processes[highestPriorityIndex].completed = true;
        processes[highestPriorityIndex].finishTime = currentTime;
        completed++;
        turnaroundTimes[processes[highestPriorityIndex].id] = currentTime - processes[highestPriorityIndex].arrivalTime;
        waitingTimes[processes[highestPriorityIndex].id] = turnaroundTimes[processes[highestPriorityIndex].id] - processes[highestPriorityIndex].burstTime;
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
        priority: process.priority,
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
  