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
    <button class='close'>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"> 
        <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
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
