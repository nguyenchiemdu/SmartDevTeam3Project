const Course = require('../models/Course');
const { mutipleMongooseToObject } = require('../utilities/mongoose');

class SiteController {

    // GET /
    async home(req, res, next) {
        try {
            var courses = await Course.find({})
            console.log(courses[0])
            console.log(mutipleMongooseToObject(courses)[0])
            res.render('index.ejs', {
                courses: mutipleMongooseToObject(courses)
            });
        } catch (e) {
            console.log(e)
            res.render(e)
        }

    }
    // [GET] /courses
    async courses(req, res, next) {
        try {
            var courses = await Course.find({})
            res.render('courses-view.ejs', {
                courses: mutipleMongooseToObject(courses)
            });
        } catch (e) {
            console.log(e)
            res.json(e)
        }
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
    //GET /cart
    cart(req,res,next){
        res.json({"title": "this is cart page"})
    }
}

module.exports = new SiteController;