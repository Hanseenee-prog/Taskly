import { saveToStorage, tasks } from "../tasks.js";
import { showPopups } from "./addOrUpdateTask.js";

export async function requestNotificationPermission() {
    if (!'Notification' in window) return;

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

function showNotifications(task, isDue = false) {
    const title = isDue ? 'Task Due Now' : 'Task Reminder';

    const body = isDue ? `"${task.name}" is due now`: `"${task.name}" is due in 5 minutes`;

    const notifications = new Notification(title, {
        body: body,
        tag: task.listId,
        icon: 'images',
        requireInteraction: true, 
        data: { taskId: task.listId}
    });
};

export function startNotificationsChecker() {
    checkDueTasks();
    setInterval(checkDueTasks, 10000);
}