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
            enum: ['INTERPERSONAL', 'LEARNING', 'REVIEW', 'CHORES', 'SPORTS', 'WORK', 'SOCIAL DUTIES'],
        },
        todos: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'todos', // Reference to the Todo model
            },
        ],

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
