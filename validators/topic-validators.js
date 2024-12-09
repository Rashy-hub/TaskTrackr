import * as yup from 'yup'
import mongoose from 'mongoose'

// Validator for `id` in `req.params`
const topicIdValidator = yup.object().shape({
    id: yup
        .string()
        .required('Topic ID is required')
        .test('is-valid-id', 'Invalid topic ID', (value) => mongoose.Types.ObjectId.isValid(value)),
})

const topicBodyValidator = yup.object().shape({
    title: yup.string().required('Title is required').max(100, 'Title must be less than 100 characters').trim(),
    description: yup.string().required('Description is required').max(500, 'Description must be less than 500 characters').trim(),
    category: yup
        .string()
        .required('Category is required')
        .oneOf(['INTERPERSONAL', 'LEARNING', 'REVIEW', 'CHORES', 'SPORTS', 'WORK', 'SOCIAL DUTIES'], 'Invalid category'),
    todos: yup
        .array()
        .of(yup.string().test('is-valid-id', 'Invalid Todo ID', (value) => mongoose.Types.ObjectId.isValid(value)))
        .nullable(),

    status: yup.string().default('ACTIVE').oneOf(['ACTIVE', 'DELAYED', 'ARCHIVED'], 'Invalid status value'),
})

export { topicIdValidator, topicBodyValidator }
