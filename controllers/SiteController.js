const Course = require('../models/Course');
const { mutipleMongooseToObject } = require('../utilities/mongoose');

class SiteController {
    // GET /
    home(req, res, next) {
        var courses = db.get('courses')
        var skills = db.get('skills')
        res.render('index', { 
          course: courses.value(),
          skill: skills.value()
         });
      
      }
    // [GET] /courses
    courses(req, res, next) {
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

    // [GET] / login
    login(req, res, next) {
        res.render('login', { title: 'Login Page' });
      }
    //GET /register
    register(req, res, next) {
        res.render('register', { title: 'Register Page' });
      }
    //GET /password
    password(req, res, next) {
        res.render('password', { title: 'Password Page' });
      }
    //GET /course-view
    // courseView(req, res, next) {
    //     res.render('courses-view', { title: 'courses-view' });
    //   }
}

module.exports = new SiteController;