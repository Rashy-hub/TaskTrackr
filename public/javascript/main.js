// Intercept fetch to add Authorization header for a specific URL
;(function () {
    const originalFetch = window.fetch

    window.fetch = function (resource, init) {
        // Check if the request is to the target URL
        if (typeof resource === 'string' && resource === 'http://localhost:3000/todo') {
            // Ensure init is defined and has headers
            init = init || {}
            init.headers = init.headers || {}

            // Get the token from localStorage
            const token = localStorage.getItem('token')

            if (token) {
                // Set the Authorization header
                init.headers['Authorization'] = `Bearer ${token}`
            } else {
                // Interrupt the process and prevent fetching if no token is found
                alert('No token found! You will be logged out.')
                return Promise.reject('No token found')
            }
        }

        // Call the original fetch function with the modified parameters
        return originalFetch(resource, init)
    }

    // Prevent page refresh if no token is found
    window.addEventListener('beforeunload', (event) => {
        const token = localStorage.getItem('token')
        if (!token) {
            // Cancel the event and show a warning message
            event.preventDefault() // Cancel the event
            event.returnValue = '' // Legacy method for cross-browser support
            alert('You are being logged out due to missing token.')
            // Optionally, redirect to a login page or take other action
        }
    })
})()
// Checkbox listener to submit the form when a checkbox is clicked
const checkboxlistener = (event) => {
    const checkbox = event.target
    const containingForm = checkbox.closest('.todo-complete-form')
    if (containingForm) {
        containingForm.submit()
    } else {
        console.warn('Checkbox not found within a .todo-complete-form element.')
    }
}

// Dialog handler to display messages
const infoDialogHandler = (jsonResponse) => {
    const { title, message } = jsonResponse
    const dialog = document.getElementById('dialog-box')
    const dialogOkButton = document.getElementById('dialog-ok-button')
    const dialogHeader = document.querySelector('.dialog-header h2')
    const dialogBody = document.querySelector('.dialog-body p')

    dialogHeader.textContent = title
    dialogBody.textContent = message
    dialog.showModal()

    dialogOkButton.addEventListener('click', () => {
        dialog.close()
    })
}

// Display the logged-in user's name and update the UI
const displayLoggedInUser = (username) => {
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
}

// Display the logged-out state and clear sensitive information
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
    document.getElementById('inputTodo').disabled = true
    document.getElementById('addTodo').disabled = true
    document.getElementById('clear').disabled = true
}

// Handler to manage form submission in modals
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

// Fetch handler for modal forms
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
            console.log('Submission successful!')
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

// Modal handler for opening and closing modals
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

// Function to submit forms with the token included in the headers
async function submitFormWithToken(form) {
    const token = localStorage.getItem('token')
    const formData = new FormData(form)
    const data = {}

    formData.forEach((value, key) => {
        data[key] = value
    })

    try {
        console.log('From here fetching todo/add with token', token)
        const response = await fetch(form.action, {
            method: form.method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        })

        if (response.ok) {
            const result = await response.json()

            // Refresh the page to get the updated content
            safeReload()
            // Optional: Update the UI accordingly
        } else {
            console.error('Request failed:', response.status, response.statusText)
            // Handle error response, e.g., show an error message to the user
        }
    } catch (error) {
        console.error('Error:', error)
        // Handle network errors or other unforeseen errors
    }
}
// Check token before reloading
function safeReload() {
    const token = localStorage.getItem('token')
    if (token) {
        window.location.reload()
    } else {
        console.error('No token found. Unable to refresh the page.')
        // Optionally, redirect to login page or show a message
    }
}
// Main Code - DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners to checkboxes
    const checkboxes = document.querySelectorAll('.iscomplete')
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', checkboxlistener)
    })

    // Add event listeners to modals for register and login
    modalHandler('registerModal', 'registerButtonModal', 'registerForm', '/auth/register')
    modalHandler('loginModal', 'loginButtonModal', 'loginForm', '/auth/login')

    // Logout button handler
    const logoutButton = document.querySelector('.logoutButton')
    logoutButton.addEventListener('click', (event) => {
        displayLoggedOutPage()
        infoDialogHandler({ title: 'Logged out', message: 'See You Soon :D' })
    })

    // Check if the user is logged in
    const username = localStorage.getItem('user')
    const token = localStorage.getItem('token')

    if (username && token) {
        console.log(`user already detected ${username} ${token}`)
        displayLoggedInUser(username)
        // Add the token to all form submissions

        const forms = document.querySelectorAll('.form-with-token')
        forms.forEach((form) => {
            form.addEventListener('submit', function (event) {
                event.preventDefault()
                submitFormWithToken(form)
            })
        })
    }
})
