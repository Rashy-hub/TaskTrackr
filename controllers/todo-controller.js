const Todo = require('../models/todo')
const User = require('../models/user')

exports.getTodos = async (req, res) => {
    try {
        // Ensure req.user is populated with the authenticated user's information
        if (!req.user || !req.user.id) {
            return res.status(401).send('Unauthorized: User not authenticated')
        }

        const userId = req.user.id // Get the logged-in user's ID
        console.log(userId)
        // Validate that userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send('Invalid user ID')
        }

        // Find all todos where the user field matches the logged-in user's ID
        const todos = await Todo.find({ user: userId })

        console.log('Rendering layout with filtered todos')
        res.render('layouts/main', { todos })
    } catch (err) {
        console.error(err)
        res.status(500).send('Error retrieving todos')
    }
}

exports.addTodo = async (req, res) => {
    const { user, newTodo } = req.body
    // const currentUser = await UserModel.findOne({ _id: req.user })
    console.log(`add todo "${newTodo}" as user ${user} with id = ${req.user.id}`)
    try {
        const todo = new Todo({ text: newTodo, completed: false, user: req.user.id })
        await todo.save()
        res.json({ message: `add todo "${newTodo}" as user ${user} with id = ${req.user.id}` })
        //res.redirect('/todo')
    } catch (err) {
        console.error(err)
        res.status(500).send('Error adding todo')
    }
}
exports.completeTodo = async (req, res) => {
    const { id } = req.params

    try {
        // Find the todo by ID
        const todo = await Todo.findById(id)

        if (!todo) {
            return res.status(404).send('Todo not found')
        }

        // Toggle the 'completed' state
        todo.completed = !todo.completed

        // Save the updated todo
        await todo.save()

        // Redirect or send a success response (optional)
        res.redirect('/') // Assuming redirect on success
    } catch (err) {
        console.error(err)
        res.status(500).send('Error updating todo')
    }
}
exports.deleteTodo = async (req, res) => {
    const { id } = req.params
    try {
        await Todo.findByIdAndDelete(id)
        res.redirect('/todo')
    } catch (err) {
        console.error(err)
        res.status(500).send('Error deleting todo')
    }
}

exports.clearTodo = async (req, res) => {
    try {
        await Todo.deleteMany({})
        res.redirect('/')
    } catch (err) {
        console.error(err)
        res.status(500).send('Error deleting todo')
    }
}
