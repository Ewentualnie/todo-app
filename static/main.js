let templates = {
    login: () =>
        '<h1>Account access</h1>\n' +
        '<div class="LoginInput">\n' +
        '<label>\n' +
        '<input id="name" type="text" placeholder="example@example.com" autofocus required>\n' +
        '</label>\n' +
        '<label>\n' +
        '<input id="pass" type="password" placeholder="******" autofocus required>\n' +
        '</label>\n' +
        '</div>\n' +
        '<div class="LoginButton">\n' +
        '<div>\n' +
        '<button id="reg" onclick="registration()">Registration</button>\n' +
        '<button id="log" onclick="login()">Sign in</button>\n' +
        '</div>\n' +
        '<button id="set" onclick="settingsPage()">Settings</button>\n' +
        '</div>',
    settings: () =>
        '<h3>Application settings:</h3>\n' +
        '<div class="settings">\n' +
        'Version api:\n' +
        '<button id="v1" onclick="setApiVersion(this)">v1</button>\n' +
        '<button id="v2" onclick="setApiVersion(this)">v2</button>\n' +
        '</div>\n' +
        '<button id="back" onclick="getTasks()">Back</button>',
    main: () =>
        '<h3>Add a new task:</h3>\n' +
        '<label style="display: flex;">\n' +
        '<input onkeyup="enterCheck()" class="new_todo" autofocus autocomplete="on" placeholder="walk the neighbor\'s cat" type="text">\n' +
        '<span><button  onclick="addTask()" class="button new_todo_button">Add</button></span>\n' +
        '</label>\n' +
        `<h3 class="status_title">Active tasks: ${this.tasks.length}</h3>\n`
}

const wrapper = document.getElementById('wrapper')
const apiURL = 'http://localhost:3005/api/'
let apiVersion = 'v1'


function setApiVersion(button) {
    const another = document.getElementById(button.innerText === 'v1' ? 'v2' : 'v1')
    button.classList.add('selected')
    another.classList.remove('selected')
    apiVersion = button.innerText
}

function registration() {
    const input = {
        login: document.getElementById('name').value,
        pass: document.getElementById('pass').value
    }
    if (input.login.trim() !== '' && input.pass.trim()) {
        let params = JSON.stringify(input);
        const route = apiVersion === 'v1' ? '/register' : '/router';
        const qs = {action: apiVersion === 'v1' ? '' : 'register'};
        fetch(apiURL + apiVersion + route + '?' + new URLSearchParams(qs), {
            method: apiVersion === 'v1' ? 'POST' : 'POST',
            body: params,
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(res => res.json())
            .then((response) => {
                if (response.ok) {
                    login();
                } else {
                    alert("An error occurred. Open the developer console to view the details.")
                }
            });
    }
}

function login() {
    const input = {
        login: document.getElementById('name').value,
        pass: document.getElementById('pass').value
    }
    if (input.login.trim() !== '' && input.pass.trim()) {
        let params = JSON.stringify(input);
        const route = apiVersion === 'v1' ? '/login' : '/router';
        const qs = {action: apiVersion === 'v1' ? '' : 'login'};
        fetch(apiURL + apiVersion + route + '?' + new URLSearchParams(qs), {
            method: this.apiVersion === 'v1' ? 'POST' : 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: params
        }).then(res => res.json())
            .then(response => {
                if (response.ok) {
                    localStorage.setItem('name', input.login);
                    getTasks();
                } else if (response.error === 'not found') {
                    alert('This combination of login and password was not found');
                } else {
                    alert("An error occurred. Open the developer console to view the details.")
                }
            })
    }
}

function logout() {
    const route = apiVersion === 'v1' ? '/logout' : '/router';
    const qs = {action: apiVersion === 'v1' ? '' : 'logout'};
    fetch(apiURL + apiVersion + route + '?' + new URLSearchParams(qs), {
        method: apiVersion === 'v1' ? 'POST' : 'POST',
        credentials: 'include',
    }).then(res => res.json())
        .then((response) => {
            if (response.ok) {
                localStorage.clear();
                getTasks()
            }
        });
}

function getTasks() {
    const route = apiVersion === 'v1' ? '/items' : '/router';
    const qs = {action: apiVersion === 'v1' ? '' : 'getItems'};
    fetch(apiURL + apiVersion + route + '?' + new URLSearchParams(qs), {
        credentials: 'include',
        method: apiVersion === 'v1' ? 'GET' : 'POST',
    }).then(res => res.json())
        .then((response) => {
            if (response.error === 'forbidden') {
                loginPage()
            } else {
                this.tasks = response.items
                mainPage()
            }
        }).catch((error) => {
        this.step = 'error';
    })
}

function updateTask(index, id) {
    let request = JSON.stringify({
        id: id,
        text: this.tasks[index].text,
        checked: this.tasks[index].checked
    });
    const route = apiVersion === 'v1' ? '/items' : '/router';
    const qs = {action: apiVersion === 'v1' ? '' : 'editItem'};
    fetch(apiURL + apiVersion + route + '?' + new URLSearchParams(qs), {
        method: apiVersion === 'v1' ? 'PUT' : 'POST',
        body: request,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(res => res.json())
        .then(() => {
            this.getTasks()
        });
}

function createChild(id, child) {
    const node = document.createElement("div")
    node.id = id
    node.className = id
    node.innerHTML = child
    return node
}

let createLoginDiv = () => createChild('login', templates.login())

let createSettingsDiv = () => createChild('settings', templates.settings())

let createMainDiv = () => createChild('main', templates.main())

let createTaskDiv = (index, task) => {
    const taskDiv = document.createElement('div')
    taskDiv.append(
        createCheckedButton(index, task),
        createTextField(index, task),
        createEditDeleteButtons(index, task))
    task.checked ? taskDiv.classList.add('task', 'taskCompleted') : taskDiv.classList.add('task');
    return taskDiv
}

function createCheckedButton(index, task) {
    const button = document.createElement('button')
    const buttonSpan = document.createElement('span')

    !task.checked ? button.classList.add('task_done') : button.classList.add('task_done', 'taskButton');

    buttonSpan.style.color = !task.checked ? 'rgba(255, 255, 255, 0.8)' : '#83e5fa'
    buttonSpan.innerText = !task.checked ? '☐' : '☑';

    button.onclick = () => markTask(index, task)
    button.appendChild(buttonSpan)

    return button
}

function createEditDeleteButtons(index, task) {
    const buttons = document.createElement('div')
    const deleteButton = document.createElement('button')
    const editButton = document.createElement('button')

    editButton.innerText = '✎️'
    editButton.style.color = '#eca81a'
    editButton.onclick = () => editTask(index, task)

    deleteButton.innerText = '✕'
    deleteButton.style.color = '#cd1537'
    deleteButton.onclick = () => deleteTask(index, task)

    buttons.classList.add('button', 'check')
    buttons.append(editButton, deleteButton)

    return buttons
}

function createTextField(index, task) {
    const taskText = document.createElement('span')

    taskText.classList.add('task_content')
    taskText.innerText = `${index + 1}. ${task.text}`

    return taskText
}

function createLogoutButton() {
    const button = document.createElement('button')
    button.onclick = () => logout()
    button.className = 'logout'
    button.innerText = 'Log out'
    return button
}

function createSettingsButton() {
    const button = document.createElement('button')
    button.id = 'set'
    button.onclick = () => settingsPage()
    button.innerText = 'Settings'
    return button
}

function loginPage() {
    wrapper.childNodes.forEach(value => value.remove())
    wrapper.appendChild(createLoginDiv())
}

function mainPage() {
    wrapper.childNodes.forEach(value => value.remove())
    const main = createMainDiv()
    this.tasks.forEach((value, index) => main.appendChild(createTaskDiv(index, value)))
    const hr = document.createElement('hr')
    main.append(hr, createLogoutButton(), createSettingsButton())
    wrapper.appendChild(main)
}

function settingsPage() {
    wrapper.childNodes.forEach(value => value.remove())
    wrapper.appendChild(createSettingsDiv())
    apiVersion === 'v1' ?
        document.getElementById('v1').classList.add('selected') :
        document.getElementById('v2').classList.add('selected');
}

function markTask(index, task) {
    task.checked = !task.checked
    updateTask(index, task.id)
}

function editTask(index, task) {

}

function deleteTask(index, task) {
    let request = JSON.stringify({id: task.id,});
    const route = this.apiVersion === 'v1' ? '/items' : '/router';
    const qs = {action: apiVersion === 'v1' ? '' : 'deleteItem'};
    fetch(apiURL + apiVersion + route + '?' + new URLSearchParams(qs), {
        method: apiVersion === 'v1' ? 'DELETE' : 'POST',
        body: request,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(res => res.json())
        .then((response) => {
            if (response['ok'] === true) {
                this.getTasks()
            } else {
                alert("An error occurred. Open the developer console to view the details.")
            }
        });
}

function addTask() {
    console.log('add task')
}
function enterCheck(){
    if (event.key==="Enter"){
        addTask()
    }
}