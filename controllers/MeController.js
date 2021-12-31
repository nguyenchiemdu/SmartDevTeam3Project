const Course = require('../models/Course');
const { mutipleMongooseToObject } = require('../utilities/mongoose');

class MeController {
    // [GET] /me/stored/courses
    async storedCourses(req, res, next) {

        try {
            var courses = await Course.find({})
            res.render('me/stored-courses', {
                courses: mutipleMongooseToObject(courses)
            })
        } catch (e) {

        }
    }
}

module.exports = new MeController;