require('dotenv').config()
const Course = require('../models/Course');
const { mutipleMongooseToObject } = require('../utilities/mongoose');
const jwt = require("jsonwebtoken");

class SiteController {

    // GET /
    async home(req, res, next) {
        //Check token
        let payload
        try {
            payload = jwt.verify(req.cookies.accessToken, process.env.JWT_SECRET)

        }
        catch (e) {
            console.log(e)
            payload = null;
        }
        const username = payload == null ? null : payload.username

        //////////
        try {
            var courses = await Course.find({})
            res.render('index.ejs', {
                username : username,
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
                username : null,
                courses: mutipleMongooseToObject(courses)
            });
        } catch (e) {
            console.log(e)
            res.json(e)
        }
    }

    // [GET] / login
    login(req, res, next) {
        res.render('login', { title: 'Login Page' ,username : null});
    }

    //GET /register
    register(req, res, next) {
        res.render('register', { title: 'Register Page',username: null });
    }

    //GET /password
    password(req, res, next) {
        res.render('password', { title: 'Password Page' });
    }
    //GET /cart
    cart(req,res,next){
        res.render("shopping-cart", { title: "Register Page", username: null });
    }
}

module.exports = new SiteController;