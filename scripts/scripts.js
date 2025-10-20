import { displayTasks, displayCompletedTasks } from './display/displayTasks.js';
import { addTask } from './display/addOrUpdateTask.js';
import { toggleTheme } from './toggleBtn.js';
import { setupResetButton } from './taskControls.js';

toggleTheme();

export const pendingTasksBtn = document.querySelector('.pending-tasks-btn');
export const completedTasksBtn = document.querySelector('.completed-tasks-btn');

displayTasks();
displayCompletedTasks();
addTask();
setupResetButton();

pendingTasksBtn.style.display = 'none';

function completedTasksAnimation() {
  let activeTab = pendingTasksBtn.id;

  completedTasksBtn.addEventListener('click', () => {
    document.querySelector('.completed-tasks-container').classList.toggle('expand-in');
    document.querySelector('.list-container').classList.toggle('slide-out');
    document.querySelector('#addNewTask').classList.add('hidden');
    completedTasksBtn.style.display = 'none';
    pendingTasksBtn.style.display = 'block';
    activeTab = pendingTasksBtn.id;
  });

  pendingTasksBtn.addEventListener('click', () => {
    document.querySelector('.completed-tasks-container').classList.toggle('expand-in');
    document.querySelector('.list-container').classList.toggle('slide-out');
    document.querySelector('#addNewTask').classList.remove('hidden');
    pendingTasksBtn.style.display = 'none';
    completedTasksBtn.style.display = 'block';
    activeTab = completedTasksBtn.id;
  });
}

completedTasksAnimation();
displayCompletedTasks();
