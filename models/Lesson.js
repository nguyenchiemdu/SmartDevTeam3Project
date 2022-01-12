const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Lesson = new Schema({
    course_id : { type: Schema.Types.ObjectId, ref: 'Course' },
    urlVideo: { type: String, required: true, },
    title: { type: String, required: true, },
    // order: { type: String, required: true},
    isFinish: { type: Boolean, required: true}
}, {
    timestamps: true,
});


module.exports = mongoose.model('Lesson', Lesson);