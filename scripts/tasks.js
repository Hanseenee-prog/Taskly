export let tasks;
export let completedTasks;

loadFromStorage();

export function loadFromStorage() {
  tasks = JSON.parse(localStorage.getItem('tasks'));
  completedTasks = JSON.parse(localStorage.getItem('completedTasks'));

  if (!tasks) {
    tasks = [{
        listId: 'task-1',
        name: 'Add a task to continue',
        time: '05:00',          
        date: '2025-10-29'      
    }];
  }
  
  if (!completedTasks) {
    completedTasks = [{
        listId: 'task-5',
        name: 'You\'ve done this task',
        time: '12:00',          
        date: '2025-10-08'      
    }];
  }

  if (!'caches' in window) return;

  caches.open('taskly-data').then(cache => {
    const tasksData = { tasks, completedTasks, lastUpdated: new Date().toISOString() };
    cache.put('/tasks-data', new Response(JSON.stringify(tasksData), {
      headers: { 'Content-Type': 'application/json' }
    }));
  });
}

export function saveToStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
}