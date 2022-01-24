var authMiddleware = require("../middlerwares/auth.middleware");
const { userInfor } = require("../middlerwares/auth.middleware");
const Course = require("../models/Course");
const User = require("../models/User");

class CertificateController {
  async certificate(req, res, next) {
    try {
      const course = await Course.findOne({ _id: req.params.id });
      const userInfor = authMiddleware.userInfor(req);
      const user = await User.findOne({ _id: userInfor.id });
      const fullName = user.firstName + " " + user.lastName;
      if (!fullName) {
        throw { message: "Bạn phải nhập thông tin cá nhân trước", status: 401 };
      }
      res.render("certification/home-certification.ejs", {
        fullName,
        NameCourse: course.name,
        ...authMiddleware.userInfor(req),
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
}

module.exports = new CertificateController();
