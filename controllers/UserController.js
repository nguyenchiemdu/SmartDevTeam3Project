var authMiddleware = require("../middlerwares/auth.middleware");
const User = require("../models/User.js");
const UserCourse = require("../models/UserCourse");
const UserLesson = require("../models/UserLesson");
const Course = require("../models/Course");
class UserController {
  async show(req, res, next) {
    const userInfor = authMiddleware.userInfor(req);
    try {
      if (userInfor.id === null)
        throw { message: "Bạn phải đăng nhập trước", status: 401 };
      const user = await User.findOne({ _id: userInfor.id });
      res.render("userProfile/view-user-profile", {
        ...userInfor,
        userInfor: userInfor,
        user: user,
      });
    } catch (err) {
      next(err);
    }
  }
  async editProfile(req, res, next) {
    const userInfor = authMiddleware.userInfor(req);
    const user = await User.findOne({ _id: userInfor.id });
    res.render("user-profile", {
      ...userInfor,
      userInfor: userInfor,
      user: user,
    });
  }
  async confirmEdit(req, res, next) {
    const userInfor = authMiddleware.userInfor(req);
    const { firstName, lastName, email } = req.body;
    try {
      await User.updateOne(
        { _id: userInfor.id },
        { firstName, lastName, email }
      );
      res.redirect("/user");
    } catch (err) {
      next(err);
    }
  }
  async showCertificate(req, res, next) {
    const userInfor = authMiddleware.userInfor(req);
    const user = await User.findOne({ _id: userInfor.id });
    var CourseCompleted = await UserCourse.find({
      user_id: userInfor.id,
      isCompleted: 1,
    }).populate("course_id");
    try {
      res.render("userProfile/view-all-certificate", {
        ...userInfor,
        userInfor: userInfor,
        user: user,
        CourseCompleted,
      });
    } catch (err) {
      next(err);
    }
  }
}
module.exports = new UserController();
