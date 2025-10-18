import { tasks, completedTasks } from '../tasks.js';
import { setupTaskControls, setupCompletedTasksControls } from '../taskControls.js';
import { toggleTaskControls } from '../toggleBtn.js';
import { dateFormatter, timeFormatter } from '../utils/dateFormatter.js';

export function displayTasks() {
    if (tasks.length !== 0) {
        document.querySelector('#listItems').innerHTML = "";
    
        tasks.forEach((task) => {
            let {name, time, date, listId} = task;
            let tasksHTML;
    
            tasksHTML = `
            <li class="list-item" data-list-id="${listId}">
                <div class="task-body">
                    <div class="task">
                        <p class="task-name">${name}</p>
                        <p class="task-date">${dateFormatter(date)}, ${timeFormatter(time)}</p>
                    </div>
    
                    <span class="list-toggler js-list-toggler" id="listToggler">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708" />
                        </svg>
                    </span>
                </div>
                
                <!-- control-buttons -->
                <div class="btn-container hidden" data-btn-container-id="1">
                    <button class="list-btn delete-btn js-delete-btn" id="deleteBtn">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" > <path d="M4 7l16 0" /> 
                            <path d="M10 11l0 6" /> <path d="M14 11l0 6" /> 
                            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /> 
                            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /> 
                        </svg>
                    </button>
                    
                    <button class="list-btn edit-btn js-edit-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M17 3a2.85 2.85 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                        </svg>
                    </button>
                    
                    <button class="list-btn done-btn js-done-with-task-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <path d="M20.285 6.707a1 1 0 0 0-1.414-1.414L9 15.164l-3.871-3.871a1 1 0 0 0-1.414 1.414l4.578 4.578a1 1 0 0 0 1.414 0l10.578-10.578z"/>
                    </svg>
                    </button>
                </div>
            </li>
            `;
    
            document.querySelector('#listItems').innerHTML += tasksHTML;
        })
        toggleTaskControls();
        setupTaskControls();
    }
    else {
        document.querySelector('#listItems').innerHTML = '<div class="empty-message">You haven\'t added any tasks yet.</div>';
    }
}

export function displayCompletedTasks() {
    if (completedTasks.length !== 0) {
        document.querySelector('.completed-tasks').innerHTML = "";
    
        completedTasks.forEach((task) => {
            if (!task) return;

            let {name, time, date, listId} = task;
            let completedTasksHTML;
    
            completedTasksHTML = `
            <li class="completed-list-item" data-list-id="${listId}">
                <div class="list-item-container">
                    <div class="task-body completed-task-body">
                        <p class="task-name">${name}</p>
                        <p class="task-date">${dateFormatter(date)}, ${timeFormatter(time)}</p>

                        <svg class="completed-checkmark" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                    </div>
                    <div class="completed-tasks-delete">
                        <div class="completed-tasks-delete-btn js-delete-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" > 
                                <path d="M4 7l16 0" /> 
                                <path d="M10 11l0 6" /> <path d="M14 11l0 6" /> 
                                <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /> 
                                <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /> 
                            </svg>
                        <div>
                    </div>
                </div>
            </li>
            `;
            
            document.querySelector('.completed-tasks').innerHTML += completedTasksHTML;
        })
        setupCompletedTasksControls();
    } else {
        document.querySelector('.completed-tasks').innerHTML = '<div class="empty-message">You haven\'t completed any tasks yet.</div>';
    }
}
