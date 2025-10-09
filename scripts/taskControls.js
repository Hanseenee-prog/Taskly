import { tasks, saveToStorage, completedTasks } from './tasks.js';
import { displayTasks, displayCompletedTasks } from './display/displayTasks.js';
import { updateTask } from './display/addOrUpdateTask.js';

function getMatchingTask(listId) {
    return tasks.find(task => task.listId === listId);
}

function handleDelete(listId) {
    const index = tasks.findIndex(task => task.listId === listId);
    if (index !== -1) {
        tasks.splice(index, 1);
        saveToStorage();
    }
}

export function setupTaskControls() {
    const listContainer = document.querySelector('#listItems');
    
    listContainer.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.js-delete-btn');
        const editBtn = e.target.closest('.js-edit-btn');
        const doneBtn = e.target.closest('.js-done-with-task-btn');
        
        if (!deleteBtn && !editBtn && !doneBtn) return;
        
        const parentTaskEl = e.target.closest('[data-list-id]');
        if (!parentTaskEl) return;
        
        const listId = parentTaskEl.dataset.listId;
        const matchingTask = getMatchingTask(listId);
        
        if (deleteBtn) {
            handleDelete(listId);
            listContainer.innerHTML = '';
            displayTasks();
        }
        
        if (editBtn) {
            updateTask(matchingTask);
        }
        
        if (doneBtn) {
            handleDelete(listId);
            completedTasks.push(matchingTask);
            listContainer.innerHTML = '';
            displayTasks();
            displayCompletedTasks();
        }
    });
}