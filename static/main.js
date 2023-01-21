const tag = {
    div: () => document.createElement('div'),
    h3: () => document.createElement('h3'),
    label: () => document.createElement('label'),
    input: () => document.createElement('input'),
    span: () => document.createElement('span'),
    button: () => document.createElement('button'),
    hr: () => document.createElement('hr')
}
const templates = {
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
        '<button onclick="registration()">Registration</button>\n' +
        '<button onclick="login()">Sign in</button>\n' +
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
        '<button id="back" onclick="getTasks()">Back</button>'
}

const wrapper = () => document.getElementById('wrapper')
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
                    errorPage("An error occurred. Open the developer console to view the details.")
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
            method: apiVersion === 'v1' ? 'POST' : 'POST',
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
                    errorPage('This combination of login and password was not found')
                } else {
                    errorPage("An error occurred. Open the developer console to view the details.")
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
            getTasks()
        });
}

function deleteTask(task) {
    const route = apiVersion === 'v1' ? '/items' : '/router';
    const qs = {action: apiVersion === 'v1' ? '' : 'deleteItem'};
    fetch(apiURL + apiVersion + route + '?' + new URLSearchParams(qs), {
        method: apiVersion === 'v1' ? 'DELETE' : 'POST',
        body: JSON.stringify(task),
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(res => res.json())
        .then((response) => {
            if (response['ok']) {
                getTasks()
            } else {
                errorPage("An error occurred. Open the developer console to view the details.")
            }
        });
}

function addTask(task) {
    if (task.value.trim() !== '') {
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
                    errorPage("An error occurred. Open the developer console to view the details.")
                }
            });
    }
}

function createChild(id, child) {
    const node = tag.div()
    node.id = id
    node.className = id
    node.innerHTML = child
    return node
}

let createLoginDiv = () => createChild('login', templates.login())

let createSettingsDiv = () => createChild('settings', templates.settings())

function createMainDiv() {
    const main = tag.div()
    const addNew = tag.h3()
    const activeTasks = tag.h3()
    const hr = tag.hr()

    main.id = 'main'
    main.className = 'main'

    addNew.innerText = 'Add a new task:'

    activeTasks.innerText = `Active tasks: ${this.tasks.length}`

    main.append(addNew, createMainLabel(), hr, activeTasks)
    return main
}

function createMainLabel() {
    const label = tag.label()
    const input = tag.input()
    const span = tag.span()
    const button = tag.button()

    label.style.display = 'flex'

    input.className = 'new_todo'
    input.placeholder = "walk the neighbor's cat"
    input.onkeyup = (ev) => {
        if (ev.key === 'Enter') addTask(input)
    }

    button.onclick = () => addTask(input)
    button.className = 'new_todo_button'
    button.innerText = 'Add'

    span.append(button)
    label.append(input, span)
    return label
}

let createTaskDiv = (index, task) => {
    const taskDiv = tag.div()
    const inputDiv = createInputDiv(task)
    const displayDiv = createDisplayDiv(index, task)
    taskDiv.append(displayDiv, inputDiv)
    task.checked ? taskDiv.classList.add('task', 'taskCompleted') : taskDiv.classList.add('task');
    return taskDiv
}

function createCheckedButton(task) {
    const button = tag.button()
    const buttonSpan = tag.span()

    !task.checked ? button.classList.add('task_done') : button.classList.add('task_done', 'taskButton');

    buttonSpan.style.color = !task.checked ? 'rgba(255, 255, 255, 0.8)' : '#83e5fa'
    buttonSpan.innerText = !task.checked ? '☐' : '☑';

    button.onclick = () => markTask(task)
    button.appendChild(buttonSpan)

    return button
}

function createEditDeleteButtons(task) {
    const buttons = tag.div()
    const deleteButton = tag.button()
    const editButton = tag.button()

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
    const taskText = tag.span()

    taskText.classList.add('task_content')
    taskText.innerText = `${index + 1}. ${task.text}`

    return taskText
}

function createDisplayDiv(index, task) {
    const presentation = tag.div()
    presentation.append(
        createCheckedButton(task),
        createTextField(index, task),
        createEditDeleteButtons(task))
    presentation.style.display = task.editable ? 'none' : 'flex'
    return presentation
}

function createInputDiv(task) {
    const div = tag.div()
    const inputField = createInputField(task)

    div.append(inputField, createSaveDiscardButtons(task, inputField))

    div.style.display = task.editable ? 'flex' : 'none'
    return div
}

function createInputField(task) {
    const input = tag.input()
    input.classList.add('edit-input')
    input.value = task.text
    input.onkeyup = (ev) => {
        if (ev.key === 'Enter') save(task, input)
    }
    return input
}

function createSaveDiscardButtons(task, inputField) {
    const buttonsDiv = tag.div()
    const saveButton = tag.button()
    const discardButton = tag.button()

    saveButton.innerText = '💾'
    saveButton.style.fontSize = '16px'
    discardButton.innerText = '✕'

    saveButton.onclick = () => save(task, inputField)
    discardButton.onclick = () => {
        task.editable = false
        mainPage()
    }
    buttonsDiv.append(saveButton, discardButton)
    buttonsDiv.classList.add('edit-buttons')
    return buttonsDiv
}

function createLogoutButton() {
    const button = tag.button()
    button.onclick = () => logout()
    button.className = 'logout'
    button.innerText = 'Log out'
    return button
}

function createSettingsButton() {
    const button = tag.button()
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
    main.append(tag.hr(), createLogoutButton(), createSettingsButton())
    wrapper().appendChild(main)
}

function settingsPage() {
    wrapper().childNodes.forEach(value => value.remove())
    wrapper().appendChild(createSettingsDiv())
    document.getElementById(apiVersion === 'v1' ? 'v1' : 'v2').classList.add('selected')
}
function errorPage(message) {
    const screen = tag.div()
    const main = tag.div()
    const messageDiv = tag.div()
    screen.id = 'error'
    screen.style.width = `${document.documentElement.clientWidth}px`
    screen.style.height = `${document.documentElement.scrollHeight}px`

    main.className = 'errorBox'

    messageDiv.innerText = message
    messageDiv.className = 'errorMessage'

    main.append(messageDiv, createBackButton(screen))
    screen.append(main)
    document.documentElement.append(screen)
    setTimeout(() => screen.remove(), 3000);
}
function createBackButton(div) {
    const backButton = tag.button()
    backButton.onclick = () => div.remove()
    backButton.innerText = 'Back'
    backButton.className = 'back'
    return backButton
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
    if (inputField.value.trim()) {
        task.text = inputField.value
        task.editable = false
        updateTask(task);
    }
}