const mongoose = require('mongoose');

async function connect() {

    try {
        await mongoose.connect('mongodb+srv://du_2001:chiemdu552001@cluster0.qliwc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true
        });
        console.log('Connect successfully!');
    } catch (error) {
        console.log('Connect failure!');
    }

}

module.exports = { connect };
