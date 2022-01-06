require('dotenv').config()
const Course = require('../models/Course');
const { mutipleMongooseToObject } = require('../utilities/mongoose');
const jwt = require("jsonwebtoken");
var authMiddleware = require("../middlerwares/auth.middleware")
class SiteController {

    // GET /
    async home(req, res, next) {

        //////////
        try {
            var courses = await Course.find({})
            res.render('index.ejs', {
                ...authMiddleware.userInfor(req),
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
                ...authMiddleware.userInfor(req),
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
                ...authMiddleware.userInfor(req),
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
                ...authMiddleware.userInfor(req),
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
                ...authMiddleware.userInfor(req),
                courses: mutipleMongooseToObject(courses)
            });
        } catch (e) {
            console.log(e);
            res.json(e);
        }
    }


    // [GET] / login
    login(req, res, next) {
        const userInfor = authMiddleware.userInfor(req);
        if (userInfor.username != null) return res.redirect('/')
        res.render('login', { title: 'Login Page', ...authMiddleware.userInfor(req) });
    }

    //GET /register
    register(req, res, next) {
        res.render('register', { title: 'Register Page', ...authMiddleware.userInfor(req) });
    }

    //GET /success
    success(req,res,next) {
        res.render('register-success',{ title: 'Success', ...authMiddleware.userInfor(req) })
    }


    //GET /password
    password(req, res, next) {
        res.render('password', { title: 'Password Page', ...authMiddleware.userInfor(req) });
    }
    //GET /cart
    cart(req, res, next) {
        res.render("shopping-cart", { title: "Cart", ...authMiddleware.userInfor(req) });
    }
    checkout(req, res, next) {
        res.render("checkout", { title: "Check Out", ...authMiddleware.userInfor(req) });
    }
    search(req,res,next){
        res.render("searchPage", { title: "Search", username: null });
    }
}

module.exports = new SiteController;