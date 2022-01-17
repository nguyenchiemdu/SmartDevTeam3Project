const Course = require("../models/Course");
const { mutipleMongooseToObject,mongooseToObject } = require("../utilities/mongoose");
const UserCart = require("../models/UserCart");
const UserCourse = require("../models/UserCourse");
var authMiddleware = require("../middlerwares/auth.middleware");
class CourseController {
  // [GET] /course/:slug
  async show(req, res, next) {
    try {
      var userInfor = authMiddleware.userInfor(req);
      var courses = await Course.findOne({ slug: req.params.slug });
      var myCourse = await UserCourse.findOne({course_id : courses._id, user_id : userInfor.id});
      const isCheckedOut = myCourse ? true : false;
      var coursesInCart = await UserCart.findOne({course_id : courses._id.toString(),user_id : userInfor.id})
      const isInCart = coursesInCart ? true : false;
      console.log(isInCart);
      console.log(isCheckedOut);
      res.render("courses/show", { course: mongooseToObject(courses), ...authMiddleware.userInfor(req),isInCart,isCheckedOut });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
}

module.exports = new CourseController();
