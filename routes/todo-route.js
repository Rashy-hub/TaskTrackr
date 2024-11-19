import express from 'express'
import * as todoController from '../controllers/todo-controller.js'
import paramsValidation from '../middleware/params-validation.js'
import { todoBodyValidator, todoIdValidator } from '../validators/todo-validators.js'
import authenticateToken from '../middleware/authenticate-token.js'
import bodyValidation from '../middleware/body-validation.js'

const todoRouter = express.Router()

todoRouter.get('/todo', authenticateToken, todoController.getTodos)
todoRouter.get('/todo/:id', authenticateToken, paramsValidation(todoIdValidator), todoController.getTodo)
todoRouter.post('/todo', authenticateToken, bodyValidation(todoBodyValidator), todoController.addTodo)
todoRouter.put('/todo/:id', authenticateToken, paramsValidation(todoIdValidator), bodyValidation(todoBodyValidator), todoController.updateTodo)
todoRouter.delete('/todo', authenticateToken, todoController.clearTodos) // deletes all todos
todoRouter.delete('/todo/:id', authenticateToken, paramsValidation(todoIdValidator), todoController.deleteTodo)

export default todoRouter
