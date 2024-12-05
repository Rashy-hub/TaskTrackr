import express from 'express'
import passport from 'passport' // Ajout de Passport
import * as todoController from '../controllers/todo-controller.js'
import paramsValidation from '../middleware/params-validation.js'
import { todoBodyValidator, todoIdValidator } from '../validators/todo-validators.js'
import bodyValidation from '../middleware/body-validation.js'

const todoRouter = express.Router()

// Remplacement de authenticateToken par Passport.js
todoRouter.get('/todo', passport.authenticate('jwt', { session: false }), todoController.getTodos)
todoRouter.get('/todo/:id', passport.authenticate('jwt', { session: false }), paramsValidation(todoIdValidator), todoController.getTodo)
todoRouter.post('/todo', passport.authenticate('jwt', { session: false }), bodyValidation(todoBodyValidator), todoController.addTodo)
todoRouter.put(
    '/todo/:id',
    passport.authenticate('jwt', { session: false }),
    paramsValidation(todoIdValidator),
    bodyValidation(todoBodyValidator),
    todoController.updateTodo
)
todoRouter.delete('/todo', passport.authenticate('jwt', { session: false }), todoController.clearTodos) // Supprime tous les todos
todoRouter.delete('/todo/:id', passport.authenticate('jwt', { session: false }), paramsValidation(todoIdValidator), todoController.deleteTodo)

export default todoRouter
