import * as yup from 'yup'
import mongoose from 'mongoose'

// Validator for `id` in `req.params` (used for `completeTodo`, `deleteTodo` et `updateTodo`)
const todoIdValidator = yup.object().shape({
    id: yup
        .string()
        .required('Todo ID is required')
        .test('is-valid-id', 'Invalid todo ID', (value) => mongoose.Types.ObjectId.isValid(value)),
})

const todoBodyValidator = yup.object().shape({
    text: yup.string().nullable().default('').max(50),

    status: yup
        .string()
        .oneOf(['DONE', 'IN PROGRESS', 'STANDBY', 'REPORTED'], 'Status must be one of the following: DONE, IN PROGRESS, STANDBY, REPORTED')
        .nullable()
        .default('IN PROGRESS')
        .required('Todo `status` field is required'),
    priority: yup
        .string()
        .oneOf(['CRUCIAL', 'IMPORTANT', 'NORMAL', 'LOW'], 'priority must be one of the following: CRUCIAL, IMPORTANT,NORMAL, LOW')
        .nullable()
        .default('NORMAL')
        .required('Todo `priority` field is required'),
    isArchived: yup.boolean().nullable().default(false),
})

export { todoIdValidator, todoBodyValidator }
