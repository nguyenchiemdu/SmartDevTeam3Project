const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const UserCourse = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    course_id: { type: Schema.Types.ObjectId, ref: "Course" },
    isCompleted: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model('UserCourse', UserCourse);