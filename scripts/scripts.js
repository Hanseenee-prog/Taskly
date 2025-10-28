import { displayTasks, displayCompletedTasks } from './display/displayTasks.js';
import { addTask } from './display/addOrUpdateTask.js';
import { setupSortButton } from './display/popups.js';
import { toggleTheme } from './toggleBtn.js';
import { setupResetButton } from './taskControls.js';
import { requestNotificationPermission, startNotificationsChecker, setupUpdateNotification } from './display/notification.js';
import './display/installUI.js';
import './display/badge.js';

// Register Service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(registration => {
        console.log('Registered', registration.scope);
      })
      .catch(error => console.log('Failed', error));
  })
}

function closePopup() {
  const closeBtn = document.querySelector('.close-notification');
  const dialogBox = document.querySelector('.notifications-popup');

  closeBtn.addEventListener('click', () => {
    dialogBox.classList.add('hidden');
  });
}

closePopup();
toggleTheme();

export const pendingTasksBtn = document.querySelector('.pending-tasks-btn');
export const completedTasksBtn = document.querySelector('.completed-tasks-btn');

setupUpdateNotification();
setupSortButton();
displayTasks();
displayCompletedTasks();
addTask();
setupResetButton();
requestNotificationPermission();
startNotificationsChecker();
completedTasksAnimation();
displayCompletedTasks();

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