require('dotenv').config()
const Course = require('../models/Course');
const Category = require('../models/Category');
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
            var data = await Promise.all([Course.find({}),Category.find({})])
            // var courses = await Course.find({})
            res.render('index.ejs', {
                username: username,
                courses: mutipleMongooseToObject(data[0]),
                categories: mutipleMongooseToObject(data[1])
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
                username: null,
                courses: mutipleMongooseToObject(courses)
            });
        } catch (e) {
            console.log(e)
            res.json(e)
        }
    }


    async learning(req, res, next) {
        try {
            var courses = await Course.find({})
            res.render('learning.ejs', {
                username: null,
                courses: mutipleMongooseToObject(courses)
            });
        } catch (e) {
            console.log(e)
            res.json(e)
        }
    }


    async home_seller(req, res, next) {
        try {
            var courses = await Course.find({})
            res.render('seller/home.ejs', {
                username: null,
                courses: mutipleMongooseToObject(courses)
            });
        } catch (e) {
            console.log(e)
            res.json(e)
        }
    }
    // add Course demo cua Trinh`
    async addCourses(req, res, next) {
        try {
            var courses = await Course.find({})
            res.render("seller/create", {
                username: null,
                courses: mutipleMongooseToObject(courses)
            });
        } catch (e) {
            console.log(e);
            res.json(e);
        }
    }


    // [GET] / login
    login(req, res, next) {
        res.render('login', { title: 'Login Page', username: null });
    }

    //GET /register
    register(req, res, next) {
        res.render('register', { title: 'Register Page', username: null });
    }


    //GET /password
    password(req, res, next) {
        res.render('password', { title: 'Password Page' });
    }
    //GET /cart
    cart(req, res, next) {
        res.render("shopping-cart", { title: "Register Page", username: null });
    }
    checkout(req,res,next){
        res.render("checkout", { title: "Check Out", username: null });
    }
}

module.exports = new SiteController;