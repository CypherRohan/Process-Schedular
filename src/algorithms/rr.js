export function runRoundRobin(procs, timeQuantum) {
    const result = [];
    const waitingTimes = {};
    const turnaroundTimes = {};
    const gantt = [];
    const processes = [...procs].map(p => ({
      ...p,
      remainingTime: p.burstTime,
      completed: false
    }));
    processes.forEach(p => {
      waitingTimes[p.id] = 0;
    });
    let currentTime = 0;
    let allCompleted = false;
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
    if (processes[0].arrivalTime > 0) {
      gantt.push({ start: 0, end: processes[0].arrivalTime, process: "Idle" });
      currentTime = processes[0].arrivalTime;
    }
    const queue = [];
    let i = 0;
    if (processes.length > 0) {
      queue.push(processes[0]);
      i = 1;
    }
    while (!allCompleted) {
      if (queue.length === 0) {
        let nextProcess = null;
        for (let j = 0; j < processes.length; j++) {
          if (!processes[j].completed && processes[j].arrivalTime > currentTime) {
            nextProcess = processes[j];
            break;
          }
        }
        if (nextProcess) {
          gantt.push({ start: currentTime, end: nextProcess.arrivalTime, process: "Idle" });
          currentTime = nextProcess.arrivalTime;
          queue.push(nextProcess);
        } else {
          allCompleted = true;
          continue;
        }
      }
      const currentProcess = queue.shift();
      while (i < processes.length && processes[i].arrivalTime <= currentTime) {
        queue.push(processes[i]);
        i++;
      }
      if (currentProcess.completed) continue;
      const executeTime = Math.min(timeQuantum, currentProcess.remainingTime);
      gantt.push({
        start: currentTime,
        end: currentTime + executeTime,
        process: currentProcess.name,
        color: currentProcess.color
      });
      currentProcess.remainingTime -= executeTime;
      currentTime += executeTime;
      if (currentProcess.remainingTime === 0) {
        currentProcess.completed = true;
        turnaroundTimes[currentProcess.id] = currentTime - currentProcess.arrivalTime;
        waitingTimes[currentProcess.id] = turnaroundTimes[currentProcess.id] - currentProcess.burstTime;
      } else {
        while (i < processes.length && processes[i].arrivalTime <= currentTime) {
          queue.push(processes[i]);
          i++;
        }
        queue.push(currentProcess);
      }
      allCompleted = processes.every(p => p.completed);
    }
    processes.forEach(process => {
      result.push({
        id: process.id,
        name: process.name,
        arrivalTime: process.arrivalTime,
        burstTime: process.burstTime,
        waitingTime: waitingTimes[process.id],
        turnaroundTime: turnaroundTimes[process.id],
        completionTime: process.arrivalTime + turnaroundTimes[process.id]
      });
    });
    return {
      processDetails: result,
      averageWaitingTime: Object.values(waitingTimes).reduce((a, b) => a + b, 0) / procs.length,
      averageTurnaroundTime: Object.values(turnaroundTimes).reduce((a, b) => a + b, 0) / procs.length,
      gantt
    };
  }
  