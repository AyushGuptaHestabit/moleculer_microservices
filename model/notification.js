const mongoose = require('mongoose');
const { Schema } = mongoose;

// User Schema
let notificationSchema = Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    isShown: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('notification', notificationSchema);