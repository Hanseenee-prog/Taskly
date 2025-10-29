import { saveToStorage, tasks } from "../tasks.js";
import { showPopups } from "./addOrUpdateTask.js";
import { updateBadgeImmediately } from './badge.js';

export async function requestNotificationPermission() {
    if (!'Notification' in window && 'serviceWorker' in navigator) return;

    const permission = await Notification.requestPermission();
    console.log(permission);

    if (permission !== 'granted') {
        showPopups('.notifications-popup');
        return;
    }
    checkDueTasks();
    return permission;
}

export function checkDueTasks() {
    if (Notification.permission !== 'granted') return;

    const now = dayjs();

    tasks.forEach(task => {
        const taskDateTime = dayjs(`${task.date} ${task.time}`);
        const timeDiff = taskDateTime.diff(now, 'minute', true);

        if (timeDiff <= 4.8 && timeDiff > 4 && !task.notified) {
            showNotifications(task);
            task.notified = true;
            saveToStorage();
            updateBadgeImmediately();
        }

        if (timeDiff <= -0.2 && timeDiff > -1 && !task.dueNotified) {
            showNotifications(task, true);
            task.dueNotified = true;
            saveToStorage();
            updateBadgeImmediately();
        }
    })
}

async function showNotifications(task, isDue = false) {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
        console.warn('Notifications or Service Workers not supported.');
        return;

    }

    const title = isDue ? 'Task Due Now' : 'Task Reminder';
    const body = isDue
        ? `"${task.name}" is due now`
        : `"${task.name}" is due in 5 minutes`;

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
        console.warn('Notification permission denied.');
        return;
    }

    const registration = await navigator.serviceWorker.ready;

    // Show notification via Service Worker
    registration.showNotification(title, {
        body,
        icon: '/imgs/Taskly-logo.svg',
        badge: '/imgs/Taskly-logo.svg',
        tag: `${task.listId}-${Date.now()}`,
        requireInteraction: true, // stays until user closes
        data: {
            taskId: task.listId,
            url: window.location.origin
        },
        vibrate: [
        500, 200, 500, 200, 1000, 300, 1000, 300, 2000]
    });

    console.log(`Notification shown for "${task.name}"`);
}

export function startNotificationsChecker() {
    checkDueTasks();
    setInterval(checkDueTasks, 10000);
    setInterval(updateBadgeImmediately, 60000);
}

function handleScrollIntoView(taskId) {
    const taskContainer = document.querySelector(`[data-list-id="${taskId}"]`);
    console.log(taskContainer);

    if (!taskContainer) return;

    taskContainer.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
    });
    taskContainer.classList.add('highlight');
    setTimeout(() => taskContainer.classList.remove('highlight'), 2000);
}

if('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', e => {
        const { action, taskId } = e.data || {};
        if (action === 'scrollToTask' && taskId) handleScrollIntoView(taskId);
    });
}

export function setupUpdateNotification() {
    if (!'serviceWorker' in navigator) return;

    window.addEventListener('load', () => {
        let newWorker;

        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('Registered', registration.scope)

                setInterval(() => registration.update(), 60 * 60 * 1000);

                // Detect when a new service worker is found
                registration.addEventListener('updatefound', () => {
                    newWorker = registration.installing;

                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) showUpdatePopup(newWorker);
                    })
                })
            })
            .catch(err => console.log(err));
    
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (refreshing) return;
            refreshing = true;
            window.location.reload();
        });
    })
}

function showUpdatePopup(newWorker) {
    console.log('update available')
    const updatePopup = document.createElement('div');
    updatePopup.className = 'update-popup';
    updatePopup.innerHTML = `
        <div class="update-popup-content">
            <div class="update-icon">
                <svg xmlns="http://www.w3org/200/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v614 2"/>
                </svg>            
            </div>
            <div class="update-text">
                <h3>Update Available! </h3>
                <p>A new version of Taskly is ready to install.</p>
            </div>
            <div class="update-buttons">
                <button class="update-btn-later">Update Available! </button>
                <button class="update-btn-now">A new version of Taskly is ready to install.</button>
            </div>
        </div>
    `;

    document.body.appendChild(updatePopup);
    setTimeout(() => updatePopup.classList.add('show'), 300);

    const laterBtn = updatePopup.querySelector('.update-btn-later');
    const updateBtn = updatePopup.querySelector('.update-btn-now');

    laterBtn.addEventListener('click', () => {
        updatePopup.classList.remove('show');
        setTimeout(() => updatePopup.remove(), 300);
    });
    console.log('popup shown')

    updateBtn.addEventListener('click', () => {
        updatePopup.classList.add('updating');
        updateBtn.textContent = 'Updating...';
        newWorker.postMessage({ type: 'SKIP_WAITING' });
    });
}