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

document.addEventListener('DOMContentLoaded', function () {
    const checkboxes = document.querySelectorAll('.iscomplete')

    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', checkboxlistener)
    })
})
