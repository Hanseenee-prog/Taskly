import { tasks, saveToStorage } from './tasks.js'
import { displayTasks } from './display/displayTasks.js';
import { updateTask } from './display/addOrUpdateTask.js';

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

function attachEventHandlers(selector, handler) {
    document.querySelectorAll(selector).forEach((button) => {
        button.addEventListener('click', () => {
            const listId = getListID(button);
            
            const matchingTask = getMatchingTask(listId);
            handler(matchingTask, listId)
        });
    });
}

export function deleteTask() 
{
    attachEventHandlers('.js-delete-btn', (_matchingTask, listId) => {
        const index = tasks.findIndex(task => task.listId === listId);
                
        tasks.splice(index, 1);
        document.querySelector('#listItems').innerHTML = '';
    
        saveToStorage();
        displayTasks();
    });
}

export function editTask() {
    attachEventHandlers('.js-edit-btn', (matchingTask, _listId) => {
        updateTask(matchingTask);
    })
}