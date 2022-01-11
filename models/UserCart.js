const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const UserCart = new Schema({
    user_id : { type: Schema.Types.ObjectId, ref: 'User' },
    course_id : { type: Schema.Types.ObjectId, ref: 'Course' },
}, {
    timestamps: true,
});


module.exports = mongoose.model('UserCart', UserCart);