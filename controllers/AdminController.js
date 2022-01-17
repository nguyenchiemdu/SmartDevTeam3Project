const Course = require("../models/Course");
const { mutipleMongooseToObject } = require("../utilities/mongoose");
var authMiddleware = require("../middlerwares/auth.middleware")
class AdminController {
  async show(req, res, next) {
    try {
      var courses = await Course.find({});
      res.render("admin/dashboard-admin", { ...authMiddleware.userInfor(req) });
    } catch (e) {
      console.log(e)
      next(e)
    }
  }
}

module.exports = new AdminController();
