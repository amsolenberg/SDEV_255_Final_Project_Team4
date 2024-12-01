const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    major: {
        type: String
    },
    enrollmentDate: {
        type: Date,
        default: Date.now
    },
    enrollments: [{
        course: {
            type: Schema.Types.ObjectId,
            ref: "Course",
        },
        enrolledAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {timestamps: true});

const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);
module.exports = Student;