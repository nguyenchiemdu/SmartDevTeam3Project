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
  async kiemduyet(req, res, next) {
    const courseIsNotValidate = await Course.find({isValidated: 0}).populate('user_id')
    console.log(courseIsNotValidate);
    try {
      res.render("admin/kiemduyet",{ ...authMiddleware.userInfor(req), courseIsNotValidate});
    } catch (e) {
      console.log(e);
      res.json(e);
    }
  }
  async viewDetail(req, res, next) {
    
    const courseSlug = await Course.findOne({slug: req.params.slug}).populate("user_id");
    try {
      res.render("admin/viewdetail",{ ...authMiddleware.userInfor(req), course: courseSlug});
    } catch (e) {
      console.log(e);
      res.json(e);
    }
  }
  async confirm(req, res, next) {
    try {
      await Course.updateOne({_id: req.params.id},{isValidated: 1});
      res.redirect("/admin/kiemduyet");
    } catch (e) {
      console.log(e);
      res.json(e);
    }
  }
  async signout(req, res, next) {
    // Clear cookie 
    res.clearCookie('accessToken')
    res.redirect('/login')
  }
}

module.exports = new AdminController();
