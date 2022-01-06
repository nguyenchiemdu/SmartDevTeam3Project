const Course = require("../models/Course");
const { mutipleMongooseToObject,mongooseToObject } = require("../utilities/mongoose");
var authMiddleware = require("../middlerwares/auth.middleware")
class CourseController {
  // [GET] /course/:slug
  async show(req, res, next) {
    try {
      var courses = await Course.findOne({ slug: req.params.slug });
      console.log(courses._id.toString())
      res.render("courses/show", { course: mongooseToObject(courses), ...authMiddleware.userInfor(req) });
    } catch (e) {
      console.log(e);
      res.json(e);
    }
  }
}

module.exports = new CourseController();
