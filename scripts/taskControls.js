import { tasks, saveToStorage } from './tasks.js'
import { displayTasks } from './displayTasks.js';

function getMatchingTask(listId) {
    let matchingTask;

    tasks.forEach((task) => {
        if (task.listId === listId) {
            matchingTask = task
        };
    })

    return matchingTask;
}

function getListID(btn) {
    const parent = btn.parentElement.parentElement;
    const {listId} = parent.dataset;
    return listId;
}

export function deleteTask() {
    let matchingTask;
    
    document.querySelectorAll('.js-delete-btn').forEach((button) => {
        
        button.addEventListener('click', () => {
            let listId = getListID(button);
            
            matchingTask = getMatchingTask(listId);
            const index = tasks.indexOf(matchingTask);
            
            tasks.splice(index, 1);
            document.querySelector('#listItems').innerHTML = '';

            saveToStorage();
            displayTasks();
        })
    })
}

function editTask() {
    
}