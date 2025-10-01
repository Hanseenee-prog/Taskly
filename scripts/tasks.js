export let tasks;

loadFromStorage();

export function loadFromStorage() {
  tasks = JSON.parse(localStorage.getItem('tasks'));

  if (!tasks) {
      tasks = [{
        listId: 'task-1',
        name: 'Eat food',
        date: 'Today, 5:00pm'
    },{
        listId: 'task-2',
        name: 'Wash plates',
        date: 'Tomorrow, 2:00pm'
    },{
        listId: 'task-3',
        name: 'Read books',
        date: 'Next week, 12:00pm'
    },{
        listId: 'task-4',
        name: 'Wash clothes',
        date: 'Next year, 12:00pm'
    },{
        listId: 'task-5',
        name: 'Cook soup',
        date: 'Wednesday, 12:00pm'
    }];
  }
}

export function saveToStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}