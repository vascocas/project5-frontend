
export function compareTasks(taskA, taskB) {
    // First, compare by priority
    if (taskA.priority !== taskB.priority) {
      const priorityOrder = [
        "LOW_PRIORITY",
        "MEDIUM_PRIORITY",
        "HIGH_PRIORITY",
      ];
      return (
        priorityOrder.indexOf(taskB.priority) -
        priorityOrder.indexOf(taskA.priority)
      );
    }
    // If priority is equal, compare by start date
    const startDateA = new Date(taskA.startDate);
    const startDateB = new Date(taskB.startDate);
    if (startDateA.getTime() !== startDateB.getTime()) {
      return startDateA.getTime() - startDateB.getTime();
    }
    // If start dates are equal, compare by end date
    const endDateA = new Date(taskA.endDate);
    const endDateB = new Date(taskB.endDate);
    return endDateA.getTime() - endDateB.getTime();
  }
  