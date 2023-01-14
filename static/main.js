this.tasks = [];


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
        '<div>\n' +
        '<button id="set" onclick="loadSettings()">Settings</button>\n' +
        '</div>\n' +
        '</div>',
    settings: () =>
        '<h3>Application settings:</h3>\n' +
        '<div class="settings">\n' +
        'Version api:\n' +
        '<button id="v1" onclick="setApiVersion()">v1</button>\n' +
        '<button id="v2" onclick="setApiVersion()">v2</button>\n' +
        '</div>\n' +
        '<button id="back" onclick="back()">Back</button>'
    ,
    main: () =>
        '<h3>Add a new task:</h3>\n' +
        '<label style="display: flex;">\n' +
        '<input class="new_todo" autofocus autocomplete="on" placeholder="walk the neighbor\'s cat" type="text">\n' +
        '<span><button class="button new_todo_button">Add</button></span>\n' +
        '</label>\n' +
        `<h3 class="status_title">Active tasks: ${this.tasks.length}</h3>\n`,
    task: () =>
        '<div className="task taskCompleted">\n' +
        '<div className="contentText">\n' +
        '<div>\n' +
        '<button className="task_done taskButton"><span style="color: rgb(39, 174, 96);"> ☑ </span></button>\n' +
        '<span className="task_content"> text</span>\n' +
        '</div>\n' +
        '<div className="button check">\n' +
        '<button style="color: rgb(236, 168, 26);"> ✎️</button>\n' +
        '<button style="color: rgb(205, 21, 55);"> ✕</button>\n' +
        '</div>\n' +
        '</div>\n' +
        '</div>'
}

const wrapper = document.getElementById('wrapper')
const apiURL = 'http://localhost:3005/api/'
let apiVersion = 'v1'


let start = () => {
    wrapper.childNodes.forEach(value => value.remove())
    wrapper.appendChild(createLoginDiv())
    console.log('log create')
}

function loadSettings() {
    const log = document.getElementById('login')
    wrapper.removeChild(log)
    wrapper.appendChild(createSettingsDiv())
    apiVersion === 'v1' ?
        document.getElementById('v1').classList.add('selected') :
        document.getElementById('v2').classList.add('selected');
}

function back() {
    const settings = document.getElementById("settings")
    wrapper.removeChild(settings)
    wrapper.appendChild(createLoginDiv())
}

function setApiVersion() {
    const v1 = document.getElementById('v1')
    const v2 = document.getElementById('v2')
    if (!v1.classList.contains('selected')) {
        v1.classList.add('selected')
        v2.classList.remove('selected')
        apiVersion = 'v1'
    } else {
        v1.classList.remove('selected')
        v2.classList.add('selected')
        apiVersion = 'v2'
    }
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
                start();
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
                this.step = 'login';
            } else {
                this.tasks = response.items.map((item) => {
                    item.editable = false;
                    return item;
                })
                let login = document.getElementById('login')
                wrapper.removeChild(login)
                wrapper.appendChild(createMainDiv())
                allTasks()
                addBottom()

                this.step = 'items';
            }
        }).catch((error) => {
        this.step = 'error';
    })

}


function allTasks() {
    const main = document.getElementById('main')
    for (let i = 0; i < this.tasks.length; i++) {
        main.appendChild(createTaskDiv(i + 1, this.tasks[i]))
    }
}

function addBottom() {
    const main = document.getElementById('main')
    const hr = document.createElement('hr')
    const button = document.createElement('button')
    button.onclick = () => logout()
    button.className = 'logout'
    button.innerText = 'Log out'
    main.append(hr, button)
}

function createChild(id, className, child) {
    const node = document.createElement("div")
    node.id = id
    node.className = className
    node.innerHTML = child
    return node
}

let createLoginDiv = () => createChild('login', 'login', templates.login())

let createSettingsDiv = () => createChild('settings', 'settings', templates.settings())

let createMainDiv = () => createChild('main', 'main', templates.main())

let createTaskDiv = (index, task) => {
    const mainDiv = document.createElement('div')
    mainDiv.append(createCheckedButton(task), createTextField(index, task), createEditDeleteButtons())
    task.checked ? mainDiv.classList.add('task', 'taskCompleted') : mainDiv.classList.add('task');
    return mainDiv
}

function createCheckedButton(task) {
    const button = document.createElement('button')
    const buttonSpan = document.createElement('span')

    !task.checked ? button.classList.add('task_done') : button.classList.add('task_done', 'taskButton');

    buttonSpan.style.color = !task.checked ? 'rgba(255, 255, 255, 0.8)' : '#83e5fa'
    buttonSpan.innerText = !task.checked ? '☐' : '☑';

    button.appendChild(buttonSpan)

    return button
}

function createEditDeleteButtons() {
    const buttons = document.createElement('div')
    const deleteButton = document.createElement('button')
    const editButton = document.createElement('button')

    editButton.innerText = '✎️'
    editButton.style.color = '#eca81a'

    deleteButton.innerText = '✕'
    deleteButton.style.color = '#cd1537'

    buttons.classList.add('button', 'check')
    buttons.append(editButton, deleteButton)

    return buttons
}

function createTextField(index, task) {
    const taskText = document.createElement('span')

    taskText.classList.add('task_content')
    taskText.innerText = `${index}. ${task.text}`

    return taskText
}