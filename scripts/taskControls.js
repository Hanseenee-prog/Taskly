import { tasks } from './tasks.js'

export function deleteTask(listId) {
    let matchingTask;

    tasks.forEach((task) => {
        if (task.listId === listId) {
            matchingTask = task
        };
    })
    console.log(matchingTask)
}