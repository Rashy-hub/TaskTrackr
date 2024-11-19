import * as yup from 'yup'
import mongoose from 'mongoose'

// Validator for `id` in `req.params`
const topicIdValidator = yup.object().shape({
    id: yup
        .string()
        .required('Topic ID is required')
        .test('is-valid-id', 'Invalid topic ID', (value) => mongoose.Types.ObjectId.isValid(value)),
})

// Validator for request body when creating/updating a topic
const topicBodyValidator = yup.object().shape({
    title: yup.string().required('Title is required').max(100, 'Title must be less than 100 characters').trim(),
    description: yup.string().required('Description is required').max(500, 'Description must be less than 500 characters').trim(),
    category: yup
        .string()
        .required('Category is required')
        .oneOf(['Interpersonal', 'Learning', 'Review', 'Chores', 'Well Being', 'Work', 'Social Duties'], 'Invalid category'),
    todos: yup
        .array()
        .of(yup.string().test('is-valid-id', 'Invalid Todo ID', (value) => mongoose.Types.ObjectId.isValid(value)))
        .nullable(),
    startDate: yup.date().required('Start date is required').typeError('Start date must be a valid date'),
    dueDate: yup
        .date()
        .required('Due date is required')
        .typeError('Due date must be a valid date')
        .test('is-after-startDate', 'Due date must be after the start date', function (value) {
            const { startDate } = this.parent
            return startDate ? new Date(value) > new Date(startDate) : true
        }),
    status: yup.string().required('Status is required').oneOf(['ACTIVE', 'DELAYED', 'ARCHIVED'], 'Invalid status value'),
})

export { topicIdValidator, topicBodyValidator }
