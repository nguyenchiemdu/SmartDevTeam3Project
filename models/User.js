const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const User = new Schema({
    // role_id : { type: Schema.Types.ObjectId, ref: 'Role' },
    username: { type: String, required: true, },
    password: { type: String, required: true, },
    // email: { type: String, required: true, },
}, {
    timestamps: true,
});


module.exports = mongoose.model('User', User);