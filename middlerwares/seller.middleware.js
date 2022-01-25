require('dotenv').config()
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Course = require("../models/Course");
const Lesson = require('../models/Lesson');
const Question = require('../models/Question');
class SellerMiddleware {
    async authenSellerCourse(req, res, next) {
        //Check token
        let payload
        try {
            payload = jwt.verify(req.cookies.accessToken, process.env.JWT_SECRET);
            // var currentUser = await User.findOne({_id : payload.id}).populate('role_id');
            if (req.params.courseid == null) return next();

            try { var course = await Course.findOne({ _id: req.params.courseid }); }
            catch (e) {
                return res.render('error', { error: { status: 404 }, message: 'Not found' });
            }
            if (course == null) throw { message: 'Not found', status: 404 };
            if (course.user_id != payload.id) throw { message: 'You have no permision to access thid path', status: 403 };
            next();
        }
        catch (e) {
            res.render('error', { error: e, message: e.message });
        }
    }
    async authenSellerLesson(req, res, next) {
        //Check token
        try {
            try { var lesson = await Lesson.findOne({ _id: req.params.lessonid, course_id: req.params.courseid }); }
            catch (e) {
                return res.render('error', { error: { status: 404 }, message: 'Not found' });
            }
            if (lesson == null) throw { message: 'Not found', status: 404 };
            next();
        }
        catch (e) {
            res.render('error', { error: e, message: e.message });
        }
    }
    async authenSellerQuestion(req, res, next) {
        //Check token
        try {
            try { var question = await Question.findOne({ _id: req.params.questionid, course_id: req.params.courseid }); }
            catch (e) {
                return res.render('error', { error: { status: 404 }, message: 'Not found' });
            }
            if (question == null) throw { message: 'Not found', status: 404 };
            next();
        }
        catch (e) {
            res.render('error', { error: e, message: e.message });
        }
    }
}

module.exports = new SellerMiddleware();
