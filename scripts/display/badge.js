import { countOverdueTasks } from '../utils/dateFormatter.js';
import { tasks } from '../tasks.js';

export function updateBadge(count) {
    if (!'setAppBadge' in navigator) return;

    if (count > 0) {
        navigator.setAppBadge(count);
    } else {
        navigator.clearAppBadge();
    }
}

export function clearBadge() {
    if ('clearAppBadge' in navigator) navigator.clearAppBadge();
}

// Update Badge every 10 seconds
setTimeout(() => {
    const overdueTasksCount = countOverdueTasks(tasks);
    updateBadge(overdueTasksCount);
}, 10000)