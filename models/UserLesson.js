const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const UserLesson = new Schema({
    user_id : { type: Schema.Types.ObjectId, ref: 'User' },
    lesson_id : { type: String, ref: 'Lesson' },
    progress : { type: Number, default : 0 },
    isFinish : { type: Boolean, default : false },
}, {
    timestamps: true,
});


module.exports = mongoose.model('UserLesson', UserLesson);