import { saveToStorage, tasks } from '../tasks.js';
import { editTask } from '../taskControls.js';

function handleDialogBoxes() {
  const dialogBox = document.querySelector('.dialog-box');
  
    document.querySelectorAll('.close').forEach((closeBtn) => {
        closeBtn.addEventListener('click', () => {
            console.log(dialogBox)
            dialogBox.showModal()
        })
    })
    
    document.querySelector('#yes').addEventListener('click', () => {
      
    });
    document.querySelector('#no').addEventListener('click', () => {
      dialogBox.close();
    })
}

function addOrUpdateTask(name, time, date) {
  const html = `
    <button class='close'>Close</button>
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
  handleDialogBoxes();
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
          
          if(nameValue === '' || timeValue === '' || dateValue === '') {
            e.preventDefault();
          } else {
            tasks.push({
              listId: `task-${tasks.length + 1}`,
              name: nameValue,
              time: timeValue,
              date: dateValue
            })
            console.log(tasks[tasks.length - 1].listId)
          }
          
          saveToStorage();
      })
  })
}
