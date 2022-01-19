const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Comment = new Schema({
    user_id : { type: Schema.Types.ObjectId, ref: 'User' },
    course_id : { type: Schema.Types.ObjectId, ref: 'Course' },
    commentContent: { type: String, required: true},
    analyzeComment: {type: String, required: true}
}, {
    timestamps: true,
});


module.exports = mongoose.model('Comment', Comment);