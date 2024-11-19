import express from 'express'
import * as topicController from '../controllers/topic-controller.js'
import paramsValidation from '../middleware/params-validation.js'
import bodyValidation from '../middleware/body-validation.js'
import { topicBodyValidator, topicIdValidator } from '../validators/topic-validator.js'
import authenticateToken from '../middleware/authenticate-token.js'

const topicRouter = express.Router()

topicRouter.get('/topic', authenticateToken, topicController.getTopics)
topicRouter.get('/topic/:id', authenticateToken, paramsValidation(topicIdValidator), topicController.getTopic)
topicRouter.post('/topic', authenticateToken, bodyValidation(topicBodyValidator), topicController.addTopic)
topicRouter.put('/topic/:id', authenticateToken, paramsValidation(topicIdValidator), bodyValidation(topicBodyValidator), topicController.updateTopic)
topicRouter.delete('/topic/:id', authenticateToken, paramsValidation(topicIdValidator), topicController.deleteTopic)

export default topicRouter
