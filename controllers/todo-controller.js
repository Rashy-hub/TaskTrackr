import asyncHandler from 'express-async-handler'
import Todo from '../models/todo.js'

import { SuccessResponse } from '../utils/response-schemas.js'
import { BadRequestErrorResponse, ForbiddenErrorResponse, NotFoundErrorResponse } from '../utils/error-schemas.js'

// Get all todos
export const getTodos = asyncHandler(async (req, res) => {
    const userId = req.user.id

    // Fetch todos excluding archived ones
    const todos = await Todo.find({ user: userId, isArchived: { $ne: true } })
    const response = new SuccessResponse('Todos retrieved successfully', { todos })

    res.status(response.status).json(response)
})

// Get a single todo by id
export const getTodo = asyncHandler(async (req, res) => {
    const { id } = req.validatedParams

    const todo = await Todo.findById(id)
    if (!todo) {
        throw new NotFoundErrorResponse('Todo not found')
    }

    if (todo.user.toString() !== req.user.id) {
        throw new ForbiddenErrorResponse('Unauthorized: No allowed to get this todo (not yours) ')
    }

    const response = new SuccessResponse('Todo found successfully', { todo })
    res.status(response.status).json(response)
})

// Add a single todo by id
export const addTodo = asyncHandler(async (req, res) => {
    const { text, status, priority } = req.body

    const todo = new Todo({ text, status, priority, user: req.user.id })
    await todo.save()

    const response = new SuccessResponse('Todo added successfully', { todo })
    res.status(response.status).json(response)
})

// Update a todo by id
export const updateTodo = asyncHandler(async (req, res) => {
    const { id } = req.validatedParams
    const { text, status, priority, isArchived } = req.body

    const todo = await Todo.findById(id)
    if (!todo) {
        throw new NotFoundErrorResponse('Todo not found')
    }

    if (todo.user.toString() !== req.user.id) {
        throw new ForbiddenErrorResponse('Unauthorized: Cannot update this todo')
    }

    if (text !== undefined) {
        todo.text = text
    }
    // Update the status if it is provided
    if (status !== undefined) {
        todo.status = status
    }

    // Update the status if it is provided
    if (priority !== undefined) {
        todo.priority = priority
    }
    if (isArchived !== undefined) {
        todo.isArchived = isArchived
    }

    await todo.save()

    const response = new SuccessResponse('Todo updated successfully', { todo })
    res.status(response.status).json(response)
})

// Delete a todo by id
export const deleteTodo = asyncHandler(async (req, res) => {
    const { id } = req.validatedParams

    const todo = await Todo.findById(id)
    if (!todo) {
        throw new NotFoundErrorResponse('Todo not found')
    }

    if (todo.user.toString() !== req.user.id) {
        throw new ForbiddenErrorResponse('Unauthorized: Cannot delete this todo')
    }

    await Todo.deleteOne({ _id: id })

    const response = new SuccessResponse('Todo deleted successfully')
    res.status(response.status).json(response)
})

// Deletes all todos for a user
export const clearTodos = asyncHandler(async (req, res) => {
    const userId = req.user.id

    await Todo.deleteMany({ user: userId })

    const response = new SuccessResponse('All todos cleared successfully')
    res.status(response.status).json(response)
})
