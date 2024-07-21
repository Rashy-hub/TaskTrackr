const express = require('express')
const todoController = require('../controllers/todo-controller')

const todoRouter = express.Router()

todoRouter.get('/todo', todoController.getTodos)
todoRouter.post('/todo/add', todoController.addTodo)
todoRouter.post('/todo/complete/:id', todoController.completeTodo)
todoRouter.post('/todo/delete/:id', todoController.deleteTodo)
todoRouter.get('/todo/clear', todoController.clearTodo)

module.exports = todoRouter
