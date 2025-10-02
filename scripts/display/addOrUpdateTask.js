import { saveToStorage, tasks } from '../tasks.js';
import { editTask } from '../taskControls.js';

function addOrUpdateTask(name, time, date) {
  const html = `
    <form id='addOrUpdateTask'>
      <input type="text" placeholder="task name" 
        id='taskName' 
        value='${name}' required>
        
      <input type="time" 
        name="task-time" 
        id="taskTime" 
        value='${time}'
        required>
        
      <input type="date" 
        name="taskDate"  
        id="taskDate" 
        value='${date}'
        required>
      
      <input type='submit' value='Update Task' class='update-task-btn add-task-btn'>
    </form>
  `;
  
  document.querySelector('#addOrEditTask').innerHTML = html;
  document.querySelector('.list-container').classList.toggle('hidden');
  document.querySelector('.add-new-task').classList.toggle('hidden');
}

export function updateTask(matchingTask) {
  const {name, time, date} = matchingTask;
  addOrUpdateTask(name, time, date);
  
  document.querySelectorAll('.update-task-btn').forEach((updateTaskBtn => {
    updateTaskBtn.addEventListener('click', (e) => {
      let nameValue = document.getElementById('taskName').value;
      let timeValue = document.getElementById('taskTime').value;
      let dateValue = document.getElementById('taskDate').value;
      
      Object.assign(matchingTask, {
        name: nameValue,
        time: timeValue,
        date: dateValue
      });
      saveToStorage();
    })
  }))
}

export function addTask() {
  document.querySelector('#addNewTask').addEventListener('click', () => {
      addOrUpdateTask('','','');
      document.querySelector('.add-task-btn').value = 'Add Task';
      
      document.querySelector('.add-task-btn').addEventListener('click', () => {
          let nameValue = document.getElementById('taskName').value;
          let timeValue = document.getElementById('taskTime').value;
          let dateValue = document.getElementById('taskDate').value;
          
          tasks.push({
            name: nameValue,
            time: timeValue,
            date: dateValue
          })
          saveToStorage();
      })
  })
}
