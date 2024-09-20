const inputTask = document.getElementById("input");
const taskBtn = document.getElementById("addTaskBtn");
const desInput=document.getElementById('inputDescription');
const toDoList = document.getElementById("toDo-list");
const updateButton = document.getElementById("update-button");
let users = JSON.parse(localStorage.getItem('users')) || []; 
let currentEditingTask = null; 
let data;
users = JSON.parse(localStorage.getItem('users',data));
const secret="?T6Vdu+*ou^esBLzM58\£>";
//encrypt data
let string1=JSON.stringify(users);
let encrypted=CryptoJS.AES.encrypt(string1,secret).toString();
//decrypt data
let bytes=CryptoJS.AES.decrypt(encrypted,secret);
data=bytes.toString(CryptoJS.enc.Utf8);

localStorage.setItem('users', JSON.stringify(encrypted));
if (!Array.isArray(users)) {
  users = [];
}

//sign up page functionality
function signup(event) {
  event.preventDefault();

  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
//check if user is already exists
  let user = users.find(user => user.email === email);

  if (user) {
    if (user.password === password) {
      alert('Welcome back! Loading your to-do list.');
      loadTodoList(user.id);
    } else {
      alert('Incorrect password. Please try again.');
    }
  } else {
    const newUser = {
      id: Date.now(),
      email: email,
      password: password,
      todos: []
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    alert('Sign up successful! You can now manage your to-do list.');
    loadTodoList(newUser.id);
  }
}

//load to do list items at the refresh interval
function loadTodoList(userId) {
  const user = users.find(user => user.id === userId);
  if (user) {
    document.getElementById('signup-section').style.display = 'none';
    document.getElementById('todo-section').style.display = 'block';

    const toDoList = document.getElementById('toDo-list');
    toDoList.innerHTML = '';
    user.todos.forEach((taskText,desInput) => {
      addTaskToDOM(taskText,desInput);
    });

    sessionStorage.setItem('loggedInUser', userId);
  }
}

// add task to DOM means make structure of the task list
function addTaskToDOM(taskText,desText) {
  const li = document.createElement('li');
  li.innerHTML = `
  <div class='whole'>
    <div class='list'>
      <input type='checkbox' class='checkbox'>
      <label id='taskTag'>${taskText} </label>
      <br>
      <div class='col1'>
        <button class='edit'><i class="fa-solid fa-pen-to-square" style="color: #2db436;"></i> Edit</button>
        <button class='delete'> <i class="fa-solid fa-trash" style="color: #df1616;"></i> Delete</button>
      </div>
    </div>  
    <div class='description'id='descriptionText'> 
    <p>${desText}</p>
    </div> </div>`;
 

  document.getElementById('toDo-list').appendChild(li);
//checked and unchecked button functionality
  li.querySelector('.checkbox').onclick = function () {
    li.querySelector('label').style.textDecoration = 'line-through';
  };

  //delete task button functionality
  li.querySelector('.delete').onclick = function () {
    li.remove();
    saveTasks();
  };
//edit task button functionality
  li.querySelector('.edit').onclick = function () {
    inputTask.value = taskText; 
    desInput.value=desText;
    currentEditingTask = li; 
    taskBtn.style.display = 'none';
    updateButton.style.display = 'block';
  };
}
//update tasks button functionality
updateButton.addEventListener('click', function () {
  const saveTask = inputTask.value.trim();
 const saveDes=desInput.value.trim();
 if (saveDes === '') {
  alert('Description cannot be empty');
  return;
}
else {
  const userId = parseInt(sessionStorage.getItem('loggedInUser'), 10);
  const user = users.find(user => user.id === userId);
  if (user) {
    user.todos = user.todos.map(task => (task === currentEditingTask.querySelector('p').innerText ? saveDes : task));
    localStorage.setItem('users', JSON.stringify(users));
  }

  currentEditingTask.querySelector('p').innerText = saveDes;

  taskBtn.style.display = 'block';
  updateButton.style.display = 'none';
  desInput.value = ''; 
  inputTask.value = ''; 
  currentEditingTask = null; 
}

  if (saveTask === '') {
    alert('Input cannot be empty');
    return;
  } else {
    const userId = parseInt(sessionStorage.getItem('loggedInUser'), 10);
    const user = users.find(user => user.id === userId);
    if (user) {
      user.todos = user.todos.map(task => (task === currentEditingTask.querySelector('label').innerText ? saveTask : task));
      localStorage.setItem('users', JSON.stringify(users));
    }

    currentEditingTask.querySelector('label').innerText = saveTask;

    taskBtn.style.display = 'block';
    updateButton.style.display = 'none';
    inputTask.value = ''; 
    currentEditingTask = null; 
  }
});
//Add tasks to the list of to do's tasks 
function addTask() {
  const taskText = inputTask.value.trim();
const desText=desInput.value.trim();
  if (taskText === '') {
    alert('Task cannot be empty');
    return;
  }
  if (desText === '') {
    alert('Description cannot be empty');
    return;
  }

  const userId = parseInt(sessionStorage.getItem('loggedInUser'), 10);
  const user = users.find(user => user.id === userId);

  if (user) {
    user.todos.push(taskText);
    localStorage.setItem('users', JSON.stringify(users));
    addTaskToDOM(taskText,desText);
    inputTask.value = '';
    desInput.value='';
  }
}

//save tasks when page is refreshed or closed
function saveTasks() {
  const userId = parseInt(sessionStorage.getItem('loggedInUser'), 10);
  const user = users.find(user => user.id === userId);

  if (user) {
    user.todos = Array.from(document.querySelectorAll('#toDo-list label')).map(label => label.innerText);
    localStorage.setItem('users', JSON.stringify(users));
  }
  if (user) {
    user.todos = Array.from(document.querySelectorAll('#toDo-list p')).map(p => p.innerText);
    localStorage.setItem('users', JSON.stringify(users));
  }
}


//filter tasks by user in the search bar
function myFunction(){
  var searchInput,filter,ul,li,label,i,txtValue;
  searchInput=document.getElementById('searchInp');
  filter=searchInput.value.toUpperCase();
  ul=document.getElementById('toDo-list');
  li=ul.getElementsByTagName('li');
  for(i=0;i<li.length;i++){
    label=li[i].getElementsByTagName('label')[0];
    txtValue=label.textContent || label.innerText;
    if(txtValue.toUpperCase().indexOf(filter)>-1){
      li[i].style.display='';
    }else{
      li[i].style.display='none';
    }
  
}
}
