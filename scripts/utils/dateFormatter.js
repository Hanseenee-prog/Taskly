export function dateFormatter(date) {
    const today = dayjs();
    const lastWeek = today.subtract(7, 'day');
    const yesterday = today.subtract(1, 'day');
    const tomorrow = today.add(1, 'day');
    const nextWeek = today.add(7, 'day');
    const nextTwoWeeks = today.add(14, 'day');
    const taskDate = dayjs(date);
    
    // Present and Future dates
    if (taskDate.isSame(today, 'day')) return 'Today';
    if (taskDate.isSame(tomorrow, 'day')) return 'Tomorrow';
    if (taskDate.isAfter(tomorrow) && taskDate.isBefore(nextWeek)) return taskDate.format('dddd');
    if (taskDate.isAfter(nextWeek) && taskDate.isBefore(nextTwoWeeks)) return `Next ${taskDate.format('dddd')}`;
    if (taskDate.isAfter(nextTwoWeeks)) return taskDate.format('MMM D, YYYY');
    
    // Past dates
    if (taskDate.isSame(yesterday, 'day')) return 'Yesterday';
    if (taskDate.isBefore(yesterday) && taskDate.isAfter(lastWeek)) return `Last ${taskDate.format('ddd')}`;
    if (taskDate.isBefore(lastWeek)) return taskDate.format('MMM D, YYYY');
}

export function timeFormatter(time) {
    return dayjs(`2000-01-01T${time}`).format('hh:mm a');
}

export function isOverdue(date, time) {
    const taskDateTime = dayjs(`${date} ${time}`);
    return taskDateTime.isBefore(dayjs());
}

export function autoCheckOverdue(tasks) {
  // Auto-check overdue tasks every 1 minute
  setInterval(() => {
    document.querySelectorAll('.list-item').forEach(item => {
      const id = item.dataset.listId;
      const task = tasks.find(t => t.listId === id);
      if (!task) return;
      item.querySelector('.task-body')
          .classList.toggle('overdue', isOverdue(task.date, task.time));
    });
  }, 600);
};

export function countOverdueTasks(tasks) {
  const now = dayjs();

  return tasks.filter((task) => {
    const taskDateTime = dayjs(`${task.date} ${task.time}`);
    return taskDateTime.isBefore(now);
  }).length;
}