const express = require('express')
const todoController = require('../controllers/todo-controller')

const router = express.Router()

router.get('/', todoController.getTodos)
router.post('/add', todoController.addTodo)
router.post('/complete/:id', todoController.completeTodo)
router.post('/delete/:id', todoController.deleteTodo)

module.exports = router
