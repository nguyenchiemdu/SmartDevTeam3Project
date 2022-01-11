const Course = require("../models/Course");
const { mutipleMongooseToObject,mongooseToObject } = require("../utilities/mongoose");
const UserCart = require("../models/UserCart");
var authMiddleware = require("../middlerwares/auth.middleware");
class CourseController {
  // [GET] /course/:slug
  async show(req, res, next) {
    try {
      var userInfor = authMiddleware.userInfor(req);
      var courses = await Course.findOne({ slug: req.params.slug });
      var coursesInCart = await UserCart.findOne({course_id : courses._id.toString(),user_id : userInfor.id})
      const isInCart = coursesInCart ? true : false;
      console.log(coursesInCart);
      res.render("courses/show", { course: mongooseToObject(courses), ...authMiddleware.userInfor(req),isInCart });
    } catch (e) {
      console.log(e);
      res.json(e);
    }
  }
}

module.exports = new CourseController();
