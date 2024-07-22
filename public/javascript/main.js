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
    console.log(`${JSON.stringify(title)} and ${JONSmessage} has been received`)
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

const modalHandler = () => {
    const registerModal = document.getElementById('registerModal')
    const openModalBtn = document.querySelector('.registerButtonModal')
    const closeModalBtn = document.getElementById('closeModalBtn')
    const cancelBtn = document.getElementById('cancelBtn')
    const registerForm = document.getElementById('registerForm')

    openModalBtn.addEventListener('click', () => {
        registerModal.showModal()
    })

    closeModalBtn.addEventListener('click', () => {
        registerModal.close()
    })

    cancelBtn.addEventListener('click', () => {
        registerModal.close()
    })

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault()

        const formData = new FormData(registerForm)
        const data = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
        }

        try {
            // console.log(JSON.stringify(data))
            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: {
                    Accept: 'text/html',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            console.log(JSON.stringify(response))
            if (response.ok) {
                console.log('Registration successful!')
                registerModal.close()
                let jsonResponse = await response.json()
                console.log(jsonResponse)
                infoDialogHandler(jsonResponse)
            } else {
                console.error('Registration failed')
                // Afficher l'erreur pour l'utilisateur
                //
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

    modalHandler()
})
