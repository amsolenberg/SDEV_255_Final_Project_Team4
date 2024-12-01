const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
        uppercase: true
    },
    description: {
        type: String,
        required: true,
    },
    credits: {
        type: Number,
        required: true,
    },
    faculty: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true});

const Course = mongoose.models.Course ||  mongoose.model('Course', courseSchema);
module.exports = Course;