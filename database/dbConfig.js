const mongoose = require('mongoose');

// mongoDB connection
const DB = 'mongodb+srv://ayushguptahestabit:hestabit%40123@cluster0.iifac.mongodb.net/hestabit01?retryWrites=true&w=majority';

mongoose.connect(DB, { useNewUrlParser: true }).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
})