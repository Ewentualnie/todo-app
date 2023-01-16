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
        '<input onkeyup="addTask(this)" id="new_todo" class="new_todo" autofocus autocomplete="on" placeholder="walk the neighbor\'s cat" type="text">\n' +
        '<span><button  onclick="addTask()" class="button new_todo_button">Add</button></span>\n' +
        '</label>\n' +
        `<h3 class="status_title">Active tasks: ${this.tasks.length}</h3>\n`
}

const wrapper = () => document.getElementById('wrapper')
const apiURL = 'http://localhost:3005/api/'
const taskInput = () => document.getElementById('new_todo').value
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
                this.tasks = response.items.map((item) => {
                    item.editable = false;
                    return item;
                })
                mainPage()
            }
        })
}

function updateTask(task) {
    const route = apiVersion === 'v1' ? '/items' : '/router';
    const qs = {action: apiVersion === 'v1' ? '' : 'editItem'};
    fetch(apiURL + apiVersion + route + '?' + new URLSearchParams(qs), {
        method: apiVersion === 'v1' ? 'PUT' : 'POST',
        body: JSON.stringify(task),
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

function deleteTask(task) {
    const route = apiVersion === 'v1' ? '/items' : '/router';
    const qs = {action: apiVersion === 'v1' ? '' : 'deleteItem'};
    fetch(apiURL + apiVersion + route + '?' + new URLSearchParams(qs), {
        method: apiVersion === 'v1' ? 'DELETE' : 'POST',
        body: JSON.stringify({id: task.id,}),
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(res => res.json())
        .then((response) => {
            if (response['ok']) {
                getTasks()
            } else {
                alert("An error occurred. Open the developer console to view the details.")
            }
        });
}

function addTask(task) {
    if ((event.key === "Enter" || event.type === "click") && task.value.trim() !== '') {
        const route = apiVersion === 'v1' ? '/items' : '/router';
        const qs = {action: apiVersion === 'v1' ? '' : 'createItem'};
        fetch(apiURL + apiVersion + route + '?' + new URLSearchParams(qs), {
            method: apiVersion === 'v1' ? 'POST' : 'POST',
            body: JSON.stringify({text: task.value}),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(res => res.json())
            .then((response) => {
                if (response.id) {
                    getTasks();
                } else {
                    alert("An error occurred. Open the developer console to view the details.")
                }
            });
    }
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

function createMainDiv() {
    const main = document.createElement('div')
    const addNew = document.createElement('h3')
    const label = document.createElement('label')
    const input = document.createElement('input')
    const span = document.createElement('span')
    const button = document.createElement('button')
    const activeTasks = document.createElement('h3')

    main.id = 'main'
    main.className = 'main'

    addNew.innerText = 'Add a new task:'

    label.style.display = 'flex'

    input.className = 'new_todo'
    input.placeholder = "walk the neighbor's cat"
    input.onkeyup = () => addTask(input)

    button.onclick = () => addTask(input)
    button.className = 'new_todo_button'
    button.innerText = 'Add'

    activeTasks.innerText = `Active tasks: ${this.tasks.length}`

    span.append(button)
    label.append(input, span)
    main.append(addNew, label, activeTasks)
    return main
}

let createTaskDiv = (index, task) => {
    const taskDiv = document.createElement('div')
    const inputDiv = createInputDiv(index, task)
    const displayDiv = createDisplayDiv(index, task)
    taskDiv.append(displayDiv, inputDiv)
    task.checked ? taskDiv.classList.add('task', 'taskCompleted') : taskDiv.classList.add('task');
    return taskDiv
}

function createCheckedButton(index, task) {
    const button = document.createElement('button')
    const buttonSpan = document.createElement('span')

    !task.checked ? button.classList.add('task_done') : button.classList.add('task_done', 'taskButton');

    buttonSpan.style.color = !task.checked ? 'rgba(255, 255, 255, 0.8)' : '#83e5fa'
    buttonSpan.innerText = !task.checked ? '☐' : '☑';

    button.onclick = () => markTask(task)
    button.appendChild(buttonSpan)

    return button
}

function createEditDeleteButtons(task) {
    const buttons = document.createElement('div')
    const deleteButton = document.createElement('button')
    const editButton = document.createElement('button')

    editButton.innerText = '✎️'
    editButton.style.color = '#eca81a'
    editButton.onclick = () => editTask(task)

    deleteButton.innerText = '✕'
    deleteButton.style.color = '#cd1537'
    deleteButton.onclick = () => deleteTask(task)

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

function createDisplayDiv(index, task) {
    const presentation = document.createElement('div')
    presentation.append(
        createCheckedButton(index, task),
        createTextField(index, task),
        createEditDeleteButtons(task))
    task.editable ?
        presentation.classList.add('hidden') &&
        presentation.classList.remove('taskPresentation') :
        presentation.classList.add('taskPresentation') &&
        presentation.classList.remove('hidden');
    return presentation
}

function createInputDiv(index, task) {
    const div = document.createElement('div')
    const inputField = createInputField(index, task)

    div.append(inputField, createSaveDiscardButtons(index, task, inputField))

    div.style.display = task.editable ? 'flex' : 'none'
    div.id = index
    return div
}

function createInputField(index, task) {
    const input = document.createElement('input')
    input.classList.add('edit-input')
    input.value = task.text
    input.placeholder = task.text
    input.id = index + 'input'
    input.onkeyup = () => save(task, input)
    return input
}

function createSaveDiscardButtons(index, task, inputField) {
    const buttonsDiv = document.createElement('div')
    const saveButton = document.createElement('button')
    const discardButton = document.createElement("button")

    saveButton.innerText = '💾'
    saveButton.style.fontSize = '16px'
    discardButton.innerText = '✕'

    saveButton.onclick = () => save(task, inputField)
    discardButton.onclick = () => {
        this.tasks[index].editable = false
        mainPage()
    }
    buttonsDiv.append(saveButton, discardButton)
    buttonsDiv.classList.add('edit-buttons')
    return buttonsDiv
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
    wrapper().childNodes.forEach(value => value.remove())
    wrapper().appendChild(createLoginDiv())
}

function mainPage() {
    wrapper().childNodes.forEach(value => value.remove())
    const main = createMainDiv()
    this.tasks.forEach((value, index) => main.appendChild(createTaskDiv(index, value)))
    const hr = document.createElement('hr')
    main.append(hr, createLogoutButton(), createSettingsButton())
    wrapper().appendChild(main)
}

function settingsPage() {
    wrapper().childNodes.forEach(value => value.remove())
    wrapper().appendChild(createSettingsDiv())
    apiVersion === 'v1' ?
        document.getElementById('v1').classList.add('selected') :
        document.getElementById('v2').classList.add('selected');
}

function markTask(task) {
    task.checked = !task.checked
    updateTask(task)
}

function editTask(task) {
    task.editable = true
    mainPage()
}

function save(task, inputField) {
    if ((event.key === "Enter" || event.type === "click") && (inputField !== '' || inputField !== ' ')) {
        task.text = inputField.value
        task.editable = false
        mainPage()
        updateTask(task);
    }
}