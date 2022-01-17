const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const Lesson = new Schema({
    _id: { type: Number, ref: 'UserLesson' },
    course_id : { type: Schema.Types.ObjectId, ref: 'Course' },
    urlVideo: { type: String, required: true, },
    title: { type: String, required: true, },
    // order: { type: String, required: true},
    isFinish: { type: Boolean, required: true}
}, {
    _id: false,
    timestamps: true,
});

Lesson.plugin(AutoIncrement);

module.exports = mongoose.model('Lesson', Lesson);