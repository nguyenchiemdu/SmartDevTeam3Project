const Course = require("../models/Course");
const { mutipleMongooseToObject } = require("../utilities/mongoose");

class AdminController {
  async show(req, res, next) {
    try {
      var courses = await Course.find({});
      res.render("admin/dashboard-admin", { username: null });
    } catch (e) {
      console.log(e)
      res.json(e)
    }
  }
}

module.exports = new AdminController();
