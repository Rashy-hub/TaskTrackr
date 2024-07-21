const Todo = require('../models/todo')

exports.getTodos = async (req, res) => {
    try {
        const todos = await Todo.find()
        //res.render('partials/todos', { todos })
        res.render('layouts/main', { todos })
    } catch (err) {
        console.error(err)
        res.status(500).send('Error retrieving todos')
    }
}

exports.addTodo = async (req, res) => {
    const { newTodo } = req.body
    try {
        const todo = new Todo({ text: newTodo })
        await todo.save()
        res.redirect('/')
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
        res.redirect('/')
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
