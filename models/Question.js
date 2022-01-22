const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const Question = new Schema({
    course_id : { type: Schema.Types.ObjectId, ref: 'Course' },
    question: { type: String, required: true, },
    a: { type: String, required: true, },
    b: { type: String, required: true, },
    c: { type: String, required: true, },
    d: { type: String, required: true, },
    trueAnswer : { type: String, required: true, }
    // order: { type: String, required: true},
}, {
    timestamps: true,
});


module.exports = mongoose.model('Question', Question);