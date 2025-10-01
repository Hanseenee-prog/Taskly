import { tasks, saveToStorage } from './tasks.js'

function getMatchingTask(listId) {
    let matchingTask;

    tasks.forEach((task) => {
        if (task.listId === listId) {
            matchingTask = task
        };
    })

    return matchingTask;
}

export function deleteTask() {
    let matchingTask;
    
    document.querySelectorAll('#deleteBtn').forEach((button) => {
        
        button.addEventListener('click', () => {
            const parent = button.parentElement.parentElement;
            const {listId} = parent.dataset;
            
            matchingTask = getMatchingTask(listId);
            const index = tasks.indexOf(matchingTask);
            
            tasks.splice(index, 1);
            parent.remove();
            
            saveToStorage();
        })
    })
}