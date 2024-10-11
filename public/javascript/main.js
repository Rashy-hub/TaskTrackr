// Main Code - DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners to modals for register and login
    modalHandler('registerModal', 'registerButtonModal', 'registerForm', 'api/auth/register')
    modalHandler('loginModal', 'loginButtonModal', 'loginForm', 'api/auth/login')

    // Logout button handler
    const logoutButton = document.querySelector('.logoutButton')
    logoutButton.addEventListener('click', (event) => {
        displayLoggedOutPage()
        infoDialogHandler({ title: 'Déconnecté', message: 'À bientôt :D' })
    })

    // Add event listener for the add todo button and form
    const addTodoForm = document.querySelector('.addTodo')

    addTodoForm.addEventListener('submit', (event) => {
        event.preventDefault()
        submitFormWithToken(addTodoForm, 'POST')
        document.getElementById('inputTodo').value = ''
        document.getElementById('inputTodo').focus()
    })

    const username = localStorage.getItem('user')
    const token = localStorage.getItem('token')

    if (username && token) {
        displayLoggedInUser(username)
    }
})

// Checkbox listener to submit the form when a checkbox is clicked
const checkboxlistener = async (event) => {
    event.preventDefault()

    // Get the checkbox that triggered the event
    const checkbox = event.target

    const containingForm = checkbox.closest('.todo-complete-form')
    if (!containingForm) {
        console.warn('Checkbox not found within a .todo-complete-form element.')
        return
    }

    const action = containingForm.action
    const method = containingForm.method.toUpperCase()

    const formData = new FormData(containingForm)

    const formObject = Object.fromEntries(formData.entries())

    const token = localStorage.getItem('token')

    try {
        const response = await fetch(action, {
            method: method,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formObject),
        })

        if (response.ok) {
            const result = await response.json()
            updateTodos(result)
        } else {
            console.error('Form submission failed:', response.status, response.statusText)
        }
    } catch (error) {
        console.error('Error during form submission:', error)
    }
}

const infoDialogHandler = (jsonResponse) => {
    const { title, message } = jsonResponse
    const dialog = document.getElementById('dialog-box')
    const dialogOkButton = document.getElementById('dialog-ok-button')
    const dialogHeader = document.querySelector('.dialog-header h2')
    const dialogBody = document.querySelector('.dialog-body p')

    dialogHeader.textContent = title
    dialogBody.textContent = message
    dialog.showModal()

    const newDialogOkButton = dialogOkButton.cloneNode(true)
    dialogOkButton.parentNode.replaceChild(newDialogOkButton, dialogOkButton)

    newDialogOkButton.addEventListener('click', () => {
        dialog.close()
    })
}

const displayLoggedInUser = async (username) => {
    const userSpan = document.getElementById('userSpan')
    userSpan.innerText = username
    userSpan.style.textTransform = 'uppercase'
    document.querySelector('.loginButtonModal').classList.add('hidden')
    document.querySelector('.logoutButton').classList.remove('hidden')
    document.querySelector('.registerButtonModal').classList.add('hidden')
    document.querySelector('.todo-list').classList.remove('hidden')
    document.getElementById('usernameField').value = username
    document.getElementById('inputTodo').disabled = false
    document.getElementById('addTodo').disabled = false
    document.getElementById('clear').disabled = false
    let result = await getTodos()

    updateTodos(result)
}

const displayLoggedOutPage = () => {
    const userSpan = document.getElementById('userSpan')
    userSpan.innerText = 'Please connect to see the'
    document.getElementById('usernameField').value = ''
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    document.querySelector('.loginButtonModal').classList.remove('hidden')
    document.querySelector('.logoutButton').classList.add('hidden')
    document.querySelector('.registerButtonModal').classList.remove('hidden')
    document.querySelector('.todo-list').classList.add('hidden')
    document.getElementById('inputTodo').value = ''

    document.getElementById('inputTodo').disabled = true
    document.getElementById('addTodo').disabled = true
    document.getElementById('clear').disabled = true
}

const modalFormEventsHandler = (form, submitUrl, modal) => {
    form.addEventListener('submit', async (event) => {
        event.preventDefault()
        const formData = new FormData(form)
        const data = {}
        formData.forEach((value, key) => {
            data[key] = value
        })

        await modalFetchHandler(data, submitUrl, modal)
    })
}

const modalFetchHandler = async (data, submitUrl, modal) => {
    try {
        const response = await fetch(submitUrl, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        const jsonResponse = await response.json()
        if (response.ok) {
            modal.close()
            localStorage.setItem('token', jsonResponse.token)
            localStorage.setItem('user', jsonResponse.user)
            infoDialogHandler(jsonResponse)
            displayLoggedInUser(jsonResponse.user)
        } else {
            infoDialogHandler({ title: `Error ${jsonResponse.status}`, message: jsonResponse.message })
            console.error('Submission failed')
        }
    } catch (error) {
        console.error('Error:', error)
    }
}

const modalHandler = (modalId, buttonClass, formId, submitUrl) => {
    const modal = document.getElementById(modalId)
    const openModalBtn = document.querySelector(`.${buttonClass}`)
    const closeModalBtn = modal.querySelector('.closeModalBtn')
    const cancelBtn = modal.querySelector('.cancelBtn')
    const form = document.getElementById(formId)

    openModalBtn.addEventListener('click', () => modal.showModal())
    closeModalBtn.addEventListener('click', () => modal.close())
    cancelBtn.addEventListener('click', () => modal.close())

    modalFormEventsHandler(form, submitUrl, modal)
}

async function submitFormWithToken(form, method = 'POST') {
    const token = localStorage.getItem('token')
    const formData = new FormData(form)
    const data = {}

    formData.forEach((value, key) => {
        data[key] = value
    })

    try {
        const response = await fetch(form.action, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        })

        if (response.ok) {
            const result = await response.json()
            updateTodos(result)
        } else {
            console.error('Request failed:', response.status, response.statusText)
            const error = await response.text()
            alert(`Erreur: ${error}`)
        }
    } catch (error) {
        console.error('Error:', error)
    }
}

function updateTodos(todosData) {
    if (!todosData || todosData.todos.length === 0) {
        console.log('TODOS LIST EMPTY')
        document.querySelector('.todo-list').innerHTML = '<p>Aucune tâche à afficher.</p>'
        return
    }
    let todos = todosData.todos

    try {
        const todoList = document.querySelector('.todo-list')
        todoList.innerHTML = ''

        todos.forEach((todo) => {
            const li = document.createElement('li')
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`

            const completeForm = document.createElement('form')
            completeForm.action = `api/todo/complete/${todo._id}`
            completeForm.method = 'POST'
            completeForm.className = 'todo-complete-form form-with-token'

            const checkbox = document.createElement('input')
            checkbox.type = 'checkbox'
            checkbox.name = 'iscomplete'
            checkbox.className = 'iscomplete'
            if (todo.completed) {
                checkbox.checked = true
            }

            completeForm.appendChild(checkbox)
            li.appendChild(completeForm)

            const span = document.createElement('span')
            span.textContent = todo.text
            span.className = 'todo-text'
            li.appendChild(span)

            const actionsDiv = document.createElement('div')
            actionsDiv.className = 'actions'

            const editForm = document.createElement('form')
            editForm.className = 'form-with-token edit-form'

            const editButton = document.createElement('button')
            editButton.type = 'button' // Not a submit button
            editButton.className = 'edit-button'
            const editImg = document.createElement('img')
            editImg.src = '/assets/pen.svg'
            editImg.alt = 'edit'
            editButton.appendChild(editImg)
            editForm.appendChild(editButton)
            actionsDiv.appendChild(editForm)

            const saveButton = document.createElement('button')
            saveButton.type = 'button'
            saveButton.className = 'save-button'
            saveButton.innerText = 'Save'
            saveButton.style.display = 'none'

            actionsDiv.appendChild(saveButton)

            const editInput = document.createElement('input')
            editInput.type = 'text'
            editInput.value = todo.text
            editInput.className = 'edit-input'
            editInput.style.display = 'none'

            li.insertBefore(editInput, span)

            const deleteForm = document.createElement('form')
            deleteForm.action = `api/todo/delete/${todo._id}`
            deleteForm.method = 'POST'
            deleteForm.className = 'form-with-token'

            const deleteButton = document.createElement('button')
            deleteButton.type = 'submit'
            const deleteImg = document.createElement('img')
            deleteImg.src = '/assets/trash.svg'
            deleteImg.alt = 'trash'
            deleteButton.appendChild(deleteImg)
            deleteForm.appendChild(deleteButton)
            actionsDiv.appendChild(deleteForm)

            li.appendChild(actionsDiv)

            todoList.appendChild(li)

            checkbox.addEventListener('change', checkboxlistener)

            deleteForm.addEventListener('submit', function (event) {
                event.preventDefault()
                submitFormWithToken(deleteForm, 'POST')
            })

            editButton.addEventListener('click', () => {
                span.style.display = 'none'
                editInput.style.display = 'inline-block'
                editInput.focus()
                saveButton.style.height = '52px'
                saveButton.style.width = '45.2px'
                editButton.style.display = 'none'
                saveButton.style.display = 'inline-block'
            })

            saveButton.addEventListener('click', async () => {
                const newText = editInput.value.trim()
                if (newText === '') {
                    alert('Le texte de la tâche ne peut pas être vide.')
                    return
                }

                const token = localStorage.getItem('token')
                const todoId = todo._id

                try {
                    const response = await fetch(`api/todo/update/${todoId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ text: newText }),
                    })

                    if (response.ok) {
                        const result = await response.json()
                        updateTodos(result)
                    } else {
                        const error = await response.text()
                        console.error('Mise à jour échouée:', response.status, response.statusText, error)
                        alert('Échec de la mise à jour de la tâche.')
                    }
                } catch (error) {
                    console.error('Erreur lors de la mise à jour de la tâche:', error)
                    alert('Erreur lors de la mise à jour de la tâche.')
                }
            })
        })
    } catch (error) {
        console.error('Erreur lors de la mise à jour des todos:', error)
    }
}

async function getTodos() {
    let token = localStorage.getItem('token')
    try {
        const response = await fetch('api/todo', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })

        if (response.ok) {
            const result = await response.json()
            return result
        } else {
            console.error('Request failed:', response.status, response.statusText)
            return { todos: [] }
        }
    } catch (error) {
        console.error('Error:', error)
        return { todos: [] }
    }
}
