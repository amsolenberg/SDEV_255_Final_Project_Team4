onst
mongoose = require('mongoose')
const Schema = mongoose.Schema;

const enrollmentSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    enrollmentDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'dropped'],
        default: 'active'
    }
}, {timestamps: true});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
module.exports = Enrollment;