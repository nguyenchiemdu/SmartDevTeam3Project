const Course = require("../models/Course");
const { mutipleMongooseToObject,mongooseToObject } = require("../utilities/mongoose");

class CourseController {
  // [GET] /course/:slug
  async show(req, res, next) {
    try {
      var courses = await Course.findOne({ slug: req.params.slug });
      res.render("courses/show", { course: mongooseToObject(courses) });
    } catch (e) {
      console.log(e);
      res.json(e);
    }
  }
}

module.exports = new CourseController();
