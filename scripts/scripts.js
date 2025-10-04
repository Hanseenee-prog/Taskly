import { displayTasks, displayCompletedTasks } from './display/displayTasks.js';
import { addTask } from './display/addOrUpdateTask.js';

export const pendingTasksBtn = document.querySelector('.pending-tasks-btn');
export const completedTasksBtn = document.querySelector('.completed-tasks-btn');

displayTasks();
addTask();

function completedTasksAnimation() {
  let activeTab = pendingTasksBtn.id;

  completedTasksBtn.addEventListener('click', () => {
    document.querySelector('.completed-tasks').classList.toggle('slide-in');
    completedTasksBtn.style.display = 'none';
    pendingTasksBtn.style.display = 'block';
    activeTab = pendingTasksBtn.id;
  });

  pendingTasksBtn.addEventListener('click', () => {
    document.querySelector('.completed-tasks').classList.toggle('slide-in');
    pendingTasksBtn.style.display = 'none';
    completedTasksBtn.style.display = 'block';
    activeTab = completedTasksBtn.id;
  });
}

completedTasksAnimation();
displayCompletedTasks();