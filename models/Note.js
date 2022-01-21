const mongoose = require('mongoose');
const Lesson = require('./Lesson');

const Schema = mongoose.Schema;

const Note = new Schema({
    user_id : { type: Schema.Types.ObjectId, ref: 'User' },
    // course_id : { type: Schema.Types.ObjectId, ref: 'Course' },
    lesson_id : { type: Schema.Types.ObjectId, ref: 'Lesson' },
    commentContent: { type: String, required: true},
    second : {type : Number, required : true},
}, {
    timestamps: true,
});

module.exports = mongoose.model('Note', Note);