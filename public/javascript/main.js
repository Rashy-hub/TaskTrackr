console.log('this is my front js main.js')

const checkboxlistener = (event) => {
    const checkbox = event.target

    const containingForm = checkbox.closest('.todo-complete-form')

    if (containingForm) {
        containingForm.submit() // Submit only the relevant form
    } else {
        console.warn('Checkbox not found within a .todo-complete-form element.')
    }
}
const infoDialogHandler = (jsonResponse) => {
    const { title, message } = jsonResponse
    const dialog = document.getElementById('dialog-box')
    const dialogOkButton = document.getElementById('dialog-ok-button')
    const dialogHeader = document.querySelector('.dialog-header h2')
    const dialogBody = document.querySelector('.dialog-body p')
    console.log(`${JSON.stringify(title)} and ${JSON.stringify(message)} has been received`)
    dialogHeader.textContent = title
    dialogBody.textContent = message
    // Show the dialog
    dialog.showModal()

    /*   // Auto close the dialog after 3 seconds
    setTimeout(() => {
        dialog.close()
    }, 300 0)*/

    // Close the dialog when the OK button is clicked
    dialogOkButton.addEventListener('click', () => {
        dialog.close()
    })
}

const displayLoggedInUser = (username) => {
    const userSpan = document.getElementById('userSpan')
    userSpan.innerText = username
    userSpan.style.textTransform = 'uppercase'
    document.querySelector('.loginButtonModal').classList.toggle('hidden')
    document.querySelector('.logoutButton').classList.toggle('hidden')
    document.querySelector('.registerButtonModal').classList.toggle('hidden')

    /*     <button class="button loginButtonModal">Login</button>
            <button class="button logoutButton hidden">Logout</button>
            <button class="button registerButtonModal">Register</button> */
}

const modalHandler = (modalId, buttonClass, formId, submitUrl) => {
    const modal = document.getElementById(modalId)
    const openModalBtn = document.querySelector(`.${buttonClass}`)
    const closeModalBtn = modal.querySelector('.closeModalBtn')
    const cancelBtn = modal.querySelector('.cancelBtn')
    const form = document.getElementById(formId)

    openModalBtn.addEventListener('click', () => {
        modal.showModal()
    })

    closeModalBtn.addEventListener('click', () => {
        modal.close()
    })

    cancelBtn.addEventListener('click', () => {
        modal.close()
    })

    form.addEventListener('submit', async (event) => {
        event.preventDefault()

        const formData = new FormData(form)
        const data = {}
        formData.forEach((value, key) => {
            data[key] = value
        })

        try {
            const response = await fetch(submitUrl, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            if (response.ok) {
                console.log('Submission successful!')
                modal.close()
                const jsonResponse = await response.json()
                localStorage.setItem('token', jsonResponse.token)
                localStorage.setItem('user', jsonResponse.user)
                console.log(jsonResponse)
                infoDialogHandler(jsonResponse)
                displayLoggedInUser(jsonResponse.user)
            } else {
                let errorMessage = await response.json()

                infoDialogHandler({ title: `Error ${errorMessage.status}`, message: errorMessage.message })
                console.error('Submission failed')
                // Afficher l'erreur pour l'utilisateur
            }
        } catch (error) {
            console.error('Error:', error)
        }
    })
}

document.addEventListener('DOMContentLoaded', function () {
    const checkboxes = document.querySelectorAll('.iscomplete')

    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', checkboxlistener)
    })

    modalHandler('registerModal', 'registerButtonModal', 'registerForm', '/auth/register')
    modalHandler('loginModal', 'loginButtonModal', 'loginForm', '/auth/login')
    const logoutButton = document.querySelector('.logoutButton')

    logoutButton.addEventListener('click', (event) => {
        document.querySelector('.loginButtonModal').classList.toggle('hidden')
        document.querySelector('.logoutButton').classList.toggle('hidden')
        document.querySelector('.registerButtonModal').classList.toggle('hidden')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        infoDialogHandler({ title: 'Logged out', message: 'See You Soon :D' })
    })
})
