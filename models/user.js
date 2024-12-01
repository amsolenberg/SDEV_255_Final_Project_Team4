const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
        enum: ['student', 'faculty'],
        default: 'student',
    }
}, {timestamps: true});

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;
