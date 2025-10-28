import { tasks, saveToStorage, completedTasks } from './tasks.js';
import { displayTasks, displayCompletedTasks } from './display/displayTasks.js';
import { updateTask, showPopups } from './display/addOrUpdateTask.js';
import { updateBadgeImmediately } from './display/badge.js';

function handleClick(e, sourceArray, onEdit, onDone) {
    const deleteBtn = e.target.closest('.js-delete-btn');
    const editBtn = e.target.closest('.js-edit-btn');
    const doneBtn = e.target.closest('.js-done-with-task-btn');
    
    if (!deleteBtn && !editBtn && !doneBtn) return;
    
    const parentTaskEl = e.target.closest('[data-list-id]');
    if (!parentTaskEl) return;
    
    const listId = parentTaskEl.dataset.listId;
    const index = sourceArray.findIndex(task => task.listId === listId);
    if (index === -1) return;

    const matchingTask = sourceArray[index];

    if (deleteBtn) {
        document.querySelector('.deleted span').innerText = 'Deleted';
        sourceArray.splice(index, 1);
        showPopups('.deleted')
        saveToStorage();
        displayTasks();
        displayCompletedTasks();
        updateBadgeImmediately();
    }

    if (editBtn && onEdit) onEdit(matchingTask);
    if (doneBtn && onDone) onDone(matchingTask);
}

export function setupTaskControls() {
    const listContainer = document.querySelector('#listItems');
 
    listContainer.addEventListener('click', (e) => {
        handleClick(e, tasks, updateTask, (task) => {
            const index = tasks.findIndex(t => t.listId === task.listId);
            if (index !== -1) {
                const [doneTask] = tasks.splice(index, 1);
                completedTasks.unshift(doneTask);
                showPopups('.done')
                saveToStorage();
                displayTasks();
                displayCompletedTasks();
                updateBadgeImmediately();
            }
        });
    }); 
}

export function setupCompletedTasksControls() {
    const completedTasksContainer = document.querySelector('.completed-tasks');

    completedTasksContainer.addEventListener('click', (e) => {
        handleClick(e, completedTasks);
    });

    let activeContainer = null;

    document.querySelectorAll('.list-item-container').forEach((container) => {
        container.addEventListener('click', () => {
            if (activeContainer) {
                activeContainer.classList.remove('active');
            }

            if (activeContainer === container) {
                activeContainer = null;
            } else {
                container.classList.add('active');
                activeContainer = container;
            }

            document.querySelector('.pending-tasks-btn').addEventListener('click', () => {
                if (!container.classList.contains('active')) return;

                container.classList.remove('active');
                activeContainer = null;
            })
        });
    })
}

export function setupResetButton() {
    const resetBtn = document.querySelector('#reset');
    
    resetBtn.addEventListener('click', () => {
        const dialogBox = document.querySelector('#defaultDialog');
        const dialogBoxText = dialogBox.querySelector('span');
        
        dialogBoxText.textContent = 'Reset all tasks? This cannot be undone';
        dialogBox.showModal();
        
        const yesBtn = document.querySelector('#yes');
        const noBtn = document.querySelector('#no');            
        
        yesBtn.addEventListener('click', () => {
            dialogBox.close();
            showResetOptions();
        }, { once: true });

        noBtn.addEventListener('click', () => {
            dialogBox.close();
        }, { once: true });
    });
}

function showResetOptions() {
    const resetDialogBox = document.querySelector('#resetOptionsDialog');
    resetDialogBox.showModal();

    document.querySelectorAll('.reset-option').forEach(option => {
        option.addEventListener('click', () => {
            const type = option.dataset.type;

            if (type === 'completedTasksReset') {
                completedTasks.length = 0;
            }
            if (type === 'pendingTasksReset') {
                tasks.length = 0;
            }
            if (type === 'bothTasksReset') {
                completedTasks.length = 0;
                tasks.length = 0;
            }

            saveToStorage();
            displayTasks();
            displayCompletedTasks();
            updateBadgeImmediately();

            document.querySelector('.deleted span').innerText = 'Cleared';

            showPopups('.deleted');
            resetDialogBox.close();
        })
    });
}