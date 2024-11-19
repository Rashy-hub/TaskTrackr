import mongoose from 'mongoose'

// Define the Topic schema
const TopicSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users', // Reference to the User model
            required: [true, 'User ID is required'],
        },
        title: {
            type: String,
            required: [true, 'Title is required'],
            maxlength: [100, 'Title must be less than 100 characters'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            maxlength: [500, 'Description must be less than 500 characters'],
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: ['Interpersonal', 'Learning', 'Review', 'Chores', 'Well Being', 'Work', 'Social Duties'],
        },
        todos: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'todos', // Reference to the Todo model
            },
        ],
        startDate: {
            type: Date,
            required: [true, 'Start date is required'],
        },
        dueDate: {
            type: Date,
            required: [true, 'Due date is required'],
        },
        status: {
            type: String,
            required: true,
            enum: ['ACTIVE', 'DELAYED', 'ARCHIVED'],
            default: 'ACTIVE',
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
)

// Create the Topic model
const TopicModel = mongoose.model('topics', TopicSchema)

export default TopicModel
