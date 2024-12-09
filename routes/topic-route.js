import express from 'express'
import passport from 'passport'
import * as topicController from '../controllers/topic-controller.js'
import paramsValidation from '../middleware/params-validation.js'
import { topicBodyValidator, topicIdValidator } from '../validators/topic-validators.js'
import bodyValidation from '../middleware/body-validation.js'

const topicRouter = express.Router()

// Routes for topics
topicRouter.get('/topic', passport.authenticate('jwt', { session: false }), topicController.getTopics)
topicRouter.get('/topic/:id', passport.authenticate('jwt', { session: false }), paramsValidation(topicIdValidator), topicController.getTopic)
topicRouter.post('/topic', passport.authenticate('jwt', { session: false }), bodyValidation(topicBodyValidator), topicController.addTopic)
topicRouter.put(
    '/topic/:id',
    passport.authenticate('jwt', { session: false }),
    paramsValidation(topicIdValidator),
    bodyValidation(topicBodyValidator),
    topicController.updateTopic
)

topicRouter.delete('/topic/:id', passport.authenticate('jwt', { session: false }), paramsValidation(topicIdValidator), topicController.deleteTopic)

export default topicRouter
