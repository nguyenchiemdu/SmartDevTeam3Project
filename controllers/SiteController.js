const Course = require('../models/Course');
const { mutipleMongooseToObject } = require('../utilities/mongoose');

class SiteController {
    // [GET] /
    index(req, res, next) {
        // Course.find({}, function (err, courses) {
        //     if (!err) {
        //         res.json(courses);
        //     }
        //     else {
        //         next(err);
        //     }
        // });

        Course.find({})
            .then(courses => {
                res.render('courses-view', {
                    courses: mutipleMongooseToObject(courses)
                });
            })
            .catch(next)
        

    }

    // [GET] /
}

module.exports = new SiteController;