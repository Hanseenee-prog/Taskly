import { tasks } from './tasks.js'

export function displayTasks() {

    tasks.forEach((task) => {
        let {name, date, listId} = task;
        let tasksHTML;

        tasksHTML = `
        <li class="list-item" data-list-id="${listId}">
            <div class="task-body">
                <div class="task">
                    <p class="task-name">${name}</p>
                    <p class="task-date">${date}</p>
                </div>

                <span class="list-toggler" id="listToggler">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708" />
                    </svg>
                </span>
            </div>
            
            <!-- control-buttons -->
            <div class="btn-container hidden" data-btn-container-id="1">
                <button class="list-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" > <path d="M4 7l16 0" /> 
                        <path d="M10 11l0 6" /> <path d="M14 11l0 6" /> 
                        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /> 
                        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /> 
                    </svg>
                </button>
                <button class="list-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17 3a2.85 2.85 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                    </svg>
                </button>
                <button class="list-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </button>
            </div>
        </li>
        `;

        document.querySelector('#listItems').innerHTML += tasksHTML;
    })

    
}