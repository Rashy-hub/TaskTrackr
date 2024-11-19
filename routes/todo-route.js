import express from 'express'
import * as todoController from '../controllers/todo-controller.js'
import paramsValidation from '../middleware/params-validation.js'
import { todoBodyValidator, todoIdValidator } from '../validators/todo-validators.js'
import authenticateToken from '../middleware/authenticate-token.js'
import bodyValidation from '../middleware/body-validation.js'

const todoRouter = express.Router()

todoRouter.get('/todo', authenticateToken, todoController.getTodos)
todoRouter.get('/todo/:id', authenticateToken, paramsValidation(todoIdValidator), todoController.getTodo)
todoRouter.post('/todo/add', authenticateToken, bodyValidation(todoBodyValidator), todoController.addTodo)
todoRouter.post('/todo/complete/:id', authenticateToken, paramsValidation(todoIdValidator), todoController.completeTodo)
todoRouter.post('/todo/delete/:id', authenticateToken, paramsValidation(todoIdValidator), todoController.deleteTodo)
todoRouter.post('/todo/clear', authenticateToken, todoController.clearTodos)
todoRouter.put('/todo/update/:id', authenticateToken, paramsValidation(todoIdValidator), todoController.updateTodo)

export default todoRouter
