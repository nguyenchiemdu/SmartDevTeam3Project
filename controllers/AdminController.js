const Course = require("../models/Course");
const User = require("../models/User");
const Role = require("../models/Role");
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

    //User disable
    async userDisable(req, res, next) {
        try {
            const users = await User.find({ isActive: true });
            res.render("admin/userdisable", { ...authMiddleware.userInfor(req), users });
        } catch (e) {
            console.log(e);
            res.json(e);
        }
    }

    //User active
    async userActive(req, res, next) {
        try {
            const users = await User.find({ isActive: false });
            res.render("admin/useractive", { ...authMiddleware.userInfor(req), users });
        } catch (e) {
            console.log(e);
            res.json(e);
        }
    }

    async kiemduyet(req, res, next) {
        const courseIsNotValidate = await Course.find({ isValidated: 0 }).populate('user_id')
        // console.log(courseIsNotValidate);
        try {
            res.render("admin/kiemduyet", { ...authMiddleware.userInfor(req), courseIsNotValidate });
        } catch (e) {
            console.log(e);
            res.json(e);
        }
    }
    async viewDetail(req, res, next) {
        const courseSlug = await Course.findOne({ slug: req.params.slug }).populate("user_id");
        try {
            res.render("admin/viewdetail", { ...authMiddleware.userInfor(req), course: courseSlug });
        } catch (e) {
            console.log(e);
            res.json(e);
        }
    }

    // :PATCH disable user
    async disable(req, res, next) {
        try {
            await User.updateOne({ _id: req.params.id }, { isActive: false });
            res.redirect("/admin/userdisable");
        } catch (e) {
            console.log(e);
            res.json(e);
        }
    }

    // :PATCH active user
    async active(req, res, next) {
        try {
            await User.updateOne({ _id: req.params.id }, { isActive: true });
            res.redirect("/admin/useractive");
        } catch (e) {
            console.log(e);
            res.json(e);
        }
    }

    async confirm(req, res, next) {
        try {
            await Course.updateOne({ _id: req.params.id }, { isValidated: 1 });
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
