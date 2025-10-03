export let tasks;
export let completedTasks;

loadFromStorage();

export function loadFromStorage() {
  tasks = JSON.parse(localStorage.getItem('tasks'));
  completedTasks = JSON.parse(localStorage.getItem('completedTasks'));

  if (!tasks) {
      tasks = [{
    listId: 'task-1',
    name: 'Eat food',
    time: '05:00',          
    date: '2025-12-13'      
},{
    listId: 'task-2',
    name: 'Wash plates',
    time: '14:00',          
    date: '2025-10-02'      
},{
    listId: 'task-3',
    name: 'Read books',
    time: '23:00',          
    date: '2025-10-08'      
},{
    listId: 'task-4',
    name: 'Wash clothes',
    time: '19:00',          
    date: '2026-10-01'      
},{
    listId: 'task-5',
    name: 'Cook soup',
    time: '12:00',          
    date: '2025-10-08'      
}];
  }
  
  if (!completedTasks) {
    completedTasks = [
        {
            listId: 'task-1',
            name: 'Eat food',
            time: '05:00',
            date: '2025-12-13'  
        }
    ];
  }
}

export function saveToStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
}