console.log('this is my front js main.js')

// Function to handle checkbox change events
const checkboxlistener = (event) => {
    const checkbox = event.target // Get the checkbox that triggered the event
    // Find the closest form that contains the checkbox
    const containingForm = checkbox.closest('.todo-complete-form')

    // Check if a containing form is found
    if (containingForm) {
        containingForm.submit() // Submit only the relevant form
    } else {
        console.warn('Checkbox not found within a .todo-complete-form element.')
    }
}

// Set up event listeners when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    const checkboxes = document.querySelectorAll('.iscomplete')

    // Loop through each checkbox and add the change event listener
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', checkboxlistener)
    })
})
