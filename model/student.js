const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// teacher schema
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    fatherName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    mobile: {
        type: Number,
        // unique: true,
        required: true,
        // max: 10
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
        required: true
    },
    previousSchool: {
        type: String,
        required: true
    },
    password: {
        type: String,
        requied: true
    },
    teacher_id: [],
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

studentSchema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id.toString() }, "ayushguptahestabitayushguptahestabit");
        // this.tokens = this.tokens.concat({ token })
        await this.save();
        return token;
    } catch (error) {
        console.log(error);
    }
}

module.exports = mongoose.model('Student', studentSchema);
