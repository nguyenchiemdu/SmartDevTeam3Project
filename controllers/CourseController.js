const Course = require("../models/Course");
const {
    mutipleMongooseToObject,
    mongooseToObject,
} = require("../utilities/mongoose");
const UserCart = require("../models/UserCart");
const UserCourse = require("../models/UserCourse");
const Comment = require("../models/Comment");
var authMiddleware = require("../middlerwares/auth.middleware");
class CourseController {
    // [GET] /course/:slug
    async show(req, res, next) {
        try {
            var userInfor = authMiddleware.userInfor(req);
            var courses = await Course.findOne({ slug: req.params.slug }).populate('user_id');
            var myCourse = await UserCourse.findOne({ course_id: courses._id, user_id: userInfor.id });
            const isCheckedOut = myCourse ? true : false;
            var coursesInCart = await UserCart.findOne({
                course_id: courses._id.toString(),
                user_id: userInfor.id,
            });
            const isInCart = coursesInCart ? true : false;
            console.log(isCheckedOut);
            console.log(isInCart);
            let commentUser = await Comment.find({ course_id: courses._id })
                .populate("user_id")
                .exec()
                .then((commentUser) => {
                    return commentUser;
                });
            res.render("courses/show", {
                course: mongooseToObject(courses),
                commentUser,
                isInCart,
                isCheckedOut,
                ...authMiddleware.userInfor(req),
            });
        } catch (e) {
            console.log(e);
            next(e);
        }
    }
}

module.exports = new CourseController();
