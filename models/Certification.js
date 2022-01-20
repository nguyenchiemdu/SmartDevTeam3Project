const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Certification = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    course_id: { type: Schema.Types.ObjectId, ref: "Course" },
    name_user: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Certification", Certification);
