const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Invoice = new Schema({
    user_id : { type: Schema.Types.ObjectId, ref: 'User' },
    course_id : { type: Schema.Types.ObjectId, ref: 'Course' },
    totalPayout: {type: Number, default: 0}
}, {
    timestamps: true,
});


module.exports = mongoose.model('Invoice', Invoice);