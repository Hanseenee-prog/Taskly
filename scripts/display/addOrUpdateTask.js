import { saveToStorage, tasks } from '../tasks.js';
import { completedTasksBtn } from '../scripts.js';
import { displayTasks } from './displayTasks.js';

function showFormView() {
  if (!document.querySelector('#addOrEditTask')) return;
  
  document.querySelector('#addOrEditTask').classList.remove('hidden');
  document.querySelector('.list-container').classList.add('hidden');
  document.querySelector('.add-new-task').classList.add('hidden');
}

function showListView() {
  document.querySelector('#addOrEditTask').classList.add('hidden');
  document.querySelector('.list-container').classList.remove('hidden');
  document.querySelector('.add-new-task').classList.remove('hidden');
}

export function handleDialogBoxes(message, func, buttonType) {
  const dialogBox = document.querySelector('#defaultDialog');
  const dialogBoxText = document.querySelector('.dialog-box span');
  
  dialogBoxText.innerHTML = message;
  
  document.querySelector(buttonType).addEventListener('click', () => {
    dialogBox.showModal();
  })
  
  document.querySelector('#yes').addEventListener('click', () => {
    dialogBox.close();
    completedTasksBtn.style.display = 'block';
    func();
  });
  document.querySelector('#no').addEventListener('click', () => {
    dialogBox.close();
  })
}

function addOrUpdateTask(name, time, date, isEditMode = false, matchingTask = null) {
  showFormView();

  const html = `
    <button class='close'>
      <svg class="close-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
      </svg>
    </button>

    <form id='addOrUpdateTask'>
      <div class="form-input">
        <label for="taskName">Task name: </label>
        <input type="text" class="task-name-input" placeholder="What do you plan to do?" 
          id='taskName' 
          value='${name}' maxLength="25" required>
          
          <div class="character-count">
            <div>
              <span id="currentCount">0</span>/25 
            </div>
          </div>
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
      
      <button type='submit' class='update-task-btn add-task-btn'>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3zm-2.828 4.28a1 1 0 0 0-1.415-1.414L3.5 15.086V20.5l5.414-5.414 7.071-7.071zM21 16v6h-6"/>
        </svg> Save
      </button>
    </form>
  `;
  
  document.querySelector('#addOrEditTask').innerHTML = html;
  
  document.querySelector('#addOrUpdateTask').addEventListener('submit', (e) => {
    e.preventDefault();
    
    let nameValue = document.getElementById('taskName').value;
    let timeValue = document.getElementById('taskTime').value;
    let dateValue = document.getElementById('taskDate').value;
    
    if (!nameValue || !timeValue || !dateValue) return;
    
    if (isEditMode && matchingTask) {
      Object.assign(matchingTask, {
        name: nameValue,
        time: timeValue,
        date: dateValue
      });
    } else {
      tasks.unshift({
        listId: `task-${Date.now()}`,
        name: nameValue,
        time: timeValue,
        date: dateValue
      });
    }
    
    showPopups('.added');
    saveToStorage();
    showListView();
    displayTasks();
    completedTasksBtn.style.display = 'block';
  });
  
  if (isEditMode) handleDialogBoxes('Are you sure you want to discard changes?', showListView, '.close');
  handleInputLimit();
  if (!isEditMode) handleDialogBoxes('Are you sure you want to cancel?', showListView, '.close');
}

export function updateTask(matchingTask) {
  completedTasksBtn.style.display = 'none';
  const {name, time, date} = matchingTask;
  addOrUpdateTask(name, time, date, true, matchingTask);
}

export function addTask() {
  document.querySelector('#addNewTask').addEventListener('click', () => {
    addOrUpdateTask('', '', '', false);
    completedTasksBtn.style.display = 'none';
  });
}

function handleInputLimit() {
  const inputBox = document.getElementById('taskName');
  const currentCount = document.getElementById('currentCount');
  const inputContainer = document.querySelector('.form-input');

  if (!inputBox) return;
  currentCount.textContent = inputBox.value.length;

  inputBox.addEventListener('input', () => {
    currentCount.textContent = inputBox.value.length;
    inputContainer.classList.toggle('active', inputBox.value.length > 0);

    if (inputBox.value.length > 20) {
      inputContainer.classList.add('warning');
    } else {
      inputContainer.classList.remove('warning');
    }
  });

  inputBox.addEventListener('blur', () => {
    setTimeout(() => {
      inputContainer.classList.toggle('active');
    }, 3000)
  })
}

export function showPopups(popup) {
  setTimeout(() => {
      document.querySelector(popup).classList.toggle('hidden');
    }, 1000);
    
  document.querySelector(popup).classList.toggle('hidden');
}