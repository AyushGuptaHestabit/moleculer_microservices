const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// teacher schema
const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        required: true
    },
    currentSchool: {
        type: String,
        required: false
    },
    previousSchool: {
        type: String,
        required: false
    },
    experience: {
        type: Number,
        default: 0
    },
    password: {
        type: String,
        required: true
    },
    expertise: [{
        type: String,
        default: null
    }],
    isApproved: {
        type: Boolean,
        default: false
    },
    // tokens: [{
    //     token: {
    //         type: String,
    //         required: true
    //     }
    // }]
});

teacherSchema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id.toString() }, "ayushguptahestabitayushguptahestabit");
        // this.tokens = this.tokens.concat({ token })
        await this.save();
        return token;
    } catch (error) {
        console.log(error);
    }
}

module.exports = mongoose.model('teacher', teacherSchema);
