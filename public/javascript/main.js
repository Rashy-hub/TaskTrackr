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
            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            if (response.ok) {
                console.log('Registration successful!')
                registerModal.close()
            } else {
                console.error('Registration failed')
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
