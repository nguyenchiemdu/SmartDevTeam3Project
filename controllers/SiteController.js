const Course = require('../models/Course');
const { mutipleMongooseToObject } = require('../utilities/mongoose');

class SiteController {
    // [GET] /
    index(req, res, next) {
        Course.find({})
            .then(courses => {
                res.render('index.ejs', {
                    courses: mutipleMongooseToObject(courses)
                });
            })
            .catch(next)
    }
    courses(req, res, next) {
        Course.find({})
            .then(courses => {
                res.render('courses-view.ejs', {
                    courses: mutipleMongooseToObject(courses)
                });
            })
            .catch(next)
    }
}

module.exports = new SiteController;