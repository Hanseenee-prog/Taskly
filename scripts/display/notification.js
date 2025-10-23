import { saveToStorage, tasks } from "../tasks.js";
import { showPopups } from "./addOrUpdateTask.js";

export async function requestNotificationPermission() {
    if (!'Notification' in window && 'serviceWorker' in navigator) return;

    const permission = await Notification.requestPermission();
    console.log(permission);

    if (permission === 'granted') {
        checkDueTasks();
    } else if (permission === 'denied') {
        showPopups('.notifications-popup');
    }

    return permission;
}

export function checkDueTasks() {
    if (Notification.permission !== 'granted') return;

    const now = dayjs();

    tasks.forEach(task => {
        const taskDateTime = dayjs(`${task.date} ${task.time}`);
        const timeDiff = taskDateTime.diff(now, 'minute');

        if (timeDiff <= 5 && timeDiff > 4 && !task.notified) {
            showNotifications(task);
            task.notified = true;
            saveToStorage();
        }

        if (timeDiff <= 0 && timeDiff > -1 && !task.dueNotified) {
            showNotifications(task, true);
            task.dueNotified = true;
            saveToStorage();
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
        icon: '/imgs/Taskly-logo-dark.svg',
        badge: '/imgs/Taskly-logo-dark.svg',
        tag: task.listId,
        requireInteraction: true, // stays until user closes
        data: {
            taskId: task.listId,
            url: window.location.origin
        },
        vibrate: [200, 100, 200]
    });

    console.log(`Notification shown for "${task.name}"`);
}

export function startNotificationsChecker() {
    checkDueTasks();
    setInterval(checkDueTasks, 10000);
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