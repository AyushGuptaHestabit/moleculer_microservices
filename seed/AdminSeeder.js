const Admin = require('../model/admin');
const mongoose = require('mongoose');

// mongoDB connection
const DB = 'mongodb+srv://ayushguptahestabit:hestabit%40123@cluster0.iifac.mongodb.net/hestabit?retryWrites=true&w=majority';

mongoose.connect(DB, { useNewUrlParser: true }).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
})

const admin = new Admin({
    name: "Admin",
    email: "admin@hesatabit.in",
    password: "hestabit@123"
})

// Insertion
admin.save((err, result) => {
    if (err) {
        console.log(err);
    } else {
        console.log(result);
    }
});
