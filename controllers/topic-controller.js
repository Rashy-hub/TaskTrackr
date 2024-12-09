import asyncHandler from 'express-async-handler'
import TopicModel from '../models/topic.js'
import { SuccessResponse } from '../utils/response-schemas.js'
import { NotFoundErrorResponse, ForbiddenErrorResponse } from '../utils/error-schemas.js'

// Get all topics for a user
export const getTopics = asyncHandler(async (req, res) => {
    const userId = req.user.id

    const topics = await TopicModel.find({ userId })
    const response = new SuccessResponse('Topics retrieved successfully', { topics })

    res.status(response.status).json(response)
})

// Get a single topic by ID
export const getTopic = asyncHandler(async (req, res) => {
    const { id } = req.validatedParams

    const topic = await TopicModel.findById(id)
    if (!topic) {
        throw new NotFoundErrorResponse('Topic not found')
    }

    if (topic.userId.toString() !== req.user.id) {
        throw new ForbiddenErrorResponse('Unauthorized: Not allowed to view this topic')
    }

    const response = new SuccessResponse('Topic retrieved successfully', { topic })
    res.status(response.status).json(response)
})

// Add a new topic
export const addTopic = asyncHandler(async (req, res) => {
    const { title, description, category } = req.body

    const topic = new TopicModel({
        title,
        description,
        category,
        status: 'ACTIVE',
        userId: req.user.id,
    })

    await topic.save()

    const response = new SuccessResponse('Topic created successfully', { topic })
    res.status(response.status).json(response)
})

// Update an existing topic
export const updateTopic = asyncHandler(async (req, res) => {
    const { id } = req.validatedParams
    const { title, description, category } = req.body

    const topic = await TopicModel.findById(id)
    if (!topic) {
        throw new NotFoundErrorResponse('Topic not found')
    }

    if (topic.userId.toString() !== req.user.id) {
        throw new ForbiddenErrorResponse('Unauthorized: Cannot update this topic')
    }

    if (title !== undefined) topic.title = title
    if (description !== undefined) topic.description = description
    if (category !== undefined) topic.category = category

    await topic.save()

    const response = new SuccessResponse('Topic updated successfully', { topic })
    res.status(response.status).json(response)
})

// Delete a topic by ID
export const deleteTopic = asyncHandler(async (req, res) => {
    const { id } = req.validatedParams

    const topic = await TopicModel.findById(id)
    if (!topic) {
        throw new NotFoundErrorResponse('Topic not found')
    }

    if (topic.userId.toString() !== req.user.id) {
        throw new ForbiddenErrorResponse('Unauthorized: Cannot delete this topic')
    }

    await TopicModel.deleteOne({ _id: id })

    const response = new SuccessResponse('Topic deleted successfully')
    res.status(response.status).json(response)
})
