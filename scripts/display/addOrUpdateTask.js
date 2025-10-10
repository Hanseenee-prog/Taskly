import { saveToStorage, tasks } from '../tasks.js';
import { pendingTasksBtn, completedTasksBtn } from '../scripts.js';

function showFormView() {
  document.querySelector('#addOrEditTask').classList.remove('hidden');
  document.querySelector('.list-container').classList.add('hidden');
  document.querySelector('.add-new-task').classList.add('hidden');
}

function showListView() {
  document.querySelector('#addOrEditTask').classList.add('hidden');
  document.querySelector('.list-container').classList.remove('hidden');
  document.querySelector('.add-new-task').classList.remove('hidden');
}

function handleDialogBoxes() {
  const dialogBox = document.querySelector('.dialog-box');
  
  document.querySelectorAll('.close').forEach((closeBtn) => {
      closeBtn.addEventListener('click', () => {
          console.log(dialogBox)
          dialogBox.showModal();
      })
  })
  
  document.querySelector('#yes').addEventListener('click', () => {
    dialogBox.close();
    completedTasksBtn.style.display = 'block';
    showListView();
  });
  document.querySelector('#no').addEventListener('click', () => {
    dialogBox.close();
  })
}

function addOrUpdateTask(name, time, date) {
  const html = `
    <button class='close'>Close</button>
    <form id='addOrUpdateTask'>
      <div class="form-input">
        <label for="taskName">Task name: </label>
        <input type="text" placeholder="task name" 
          id='taskName' 
          value='${name}' required>
      </div>
      
      <div class="form-input">
        <label for="taskTime">Time for task: </label>
        <input type="time" 
          name="task-time" 
          id="taskTime" 
          value='${time}'
          required>
      </div>
      
      <div class="form-input">
        <label for="taskDate">Date for task: </label>
        <input type="date" 
          name="taskDate"  
          id="taskDate" 
          value='${date}'
          required>
      </div>
      
      <input type='submit' value='Update Task' class='update-task-btn add-task-btn'>
    </form>
  `;
  document.querySelector('#addOrEditTask').innerHTML = html;
  
  showFormView();
  handleDialogBoxes();
}

export function updateTask(matchingTask) {
  completedTasksBtn.style.display = 'none';
  
  const {name, time, date} = matchingTask;
  addOrUpdateTask(name, time, date);
  
  document.querySelectorAll('.update-task-btn').forEach((updateTaskBtn => {
    updateTaskBtn.addEventListener('click', () => {
      let nameValue = document.getElementById('taskName').value;
      let timeValue = document.getElementById('taskTime').value;
      let dateValue = document.getElementById('taskDate').value;
      
      Object.assign(matchingTask, {
        name: nameValue,
        time: timeValue,
        date: dateValue
      });
      
      completedTasksBtn.style.display = 'block';
      saveToStorage();
    })
  }))
}

export function addTask() {
  document.querySelector('#addNewTask').addEventListener('click', () => {
      addOrUpdateTask('','','');
      document.querySelector('.add-task-btn').value = 'Add Task';
      completedTasksBtn.style.display = 'none';
      
      document.querySelector('.add-task-btn').addEventListener('click', () => {
          let nameValue = document.getElementById('taskName').value;
          let timeValue = document.getElementById('taskTime').value;
          let dateValue = document.getElementById('taskDate').value;
          
          if(nameValue === '' || timeValue === '' || dateValue === '') {
            e.preventDefault();
          } else {
            tasks.push({
              listId: `task-${Date.now()}`,
              name: nameValue,
              time: timeValue,
              date: dateValue
            })
            console.log(tasks[tasks.length - 1].listId)
          }
          
          handleDialogBoxes();
          saveToStorage();
      })
  })
}
