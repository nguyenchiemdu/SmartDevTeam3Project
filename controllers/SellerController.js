require("dotenv").config();
const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const { mutipleMongooseToObject } = require("../utilities/mongoose");
var authMiddleware = require("../middlerwares/auth.middleware");
// const mongoose = require("mongoose");
const Category = require("../models/Category");
const Invoice = require("../models/Invoice");
const UserLesson = require("../models/UserLesson");
const Question = require("../models/Question");


class SellerController {
    async home_seller(req, res, next) {
        try {
            const userInfor = authMiddleware.userInfor(req);
            let userCoursesName = [],
                userCoursePrices = [];
            let courses = await Course.find({ user_id: userInfor.id });
            if (userInfor.username == null) {
                throw { message: "Bạn phải đăng nhập trước", status: 401 };
            } else {
                var validatedCourse = await Course.find({
                    user_id: userInfor.id,
                    isValidated: 1,
                });
                for (let index = 0; index < validatedCourse.length; index++) {
                    userCoursesName.push(validatedCourse[index].name);
                    const courseIsPaid = await Invoice.find({
                        course_id: validatedCourse[index]._id,
                    }).populate("course_id");
                    if (courseIsPaid.length > 0) {
                        let sum = 0;
                        courseIsPaid.forEach((course) => {
                            sum += course.totalPayout;
                        });
                        userCoursePrices.push(sum);
                    } else {
                        userCoursePrices.push(0);
                    }
                }
            }
            res.render("seller/home.ejs", {
                ...authMiddleware.userInfor(req),
                courses: courses,
                userCoursesName,
                userCoursePrices,
            });
        } catch (e) {
            console.log(e);
            next(e);
        }
    }
    //Show courses of seller
    async show(req, res, next) {
        try {
            var courses = await Course.find({});
            res.render("seller/courses.ejs", {
                ...authMiddleware.userInfor(req),
                courses: mutipleMongooseToObject(courses),
            });
        } catch (e) {
            console.log(e);
            next(e);
        }
    }
    // bill Course demo
    async billCourses(req, res, next) {
        try {
            let userInfor = authMiddleware.userInfor(req);
            let courseId = req.params.courseid;
            let invoices = await Invoice.find({ course_id: courseId })
                .populate("user_id")
                .exec()
                .then((invoices) => {
                    return invoices;
                });
            let course = await Course.findOne({ _id: courseId });

            invoices = await Promise.all(
                invoices.map(async (invoice) => {
                    //lay cac ma video(lesson)
                    var lessons = await Lesson.find({ course_id: courseId });
                    var userLesson = await UserLesson.find({ user_id: invoice.user_id });

                    //Loc 2 mang co lessonId giong nhau
                    const filterLesson = userLesson.filter((user) => {
                        return lessons.some((lesson) => user.lesson_id == lesson._id);
                    });

                    //tim tat ca cac lesson cua course
                    const countLesson = lessons.filter(
                        (countLes) =>
                            countLes.isFinish == true || countLes.isFinish == false
                    );
                    const sumCountLesson = countLesson.length;

                    //tim cac lesson da hoc
                    const countFinish = filterLesson.filter(
                        (userLes) => userLes.isFinish == true
                    );
                    const sumFinish = countFinish.length;

                    //tinh phan tram cua lesson da hoc
                    var percentFinish;
                    if (sumFinish == 0 && sumCountLesson == 0) {
                        percentFinish = 0;
                    } else {
                        percentFinish = (sumFinish / sumCountLesson) * 100;
                    }
                    invoice = JSON.parse(JSON.stringify(invoice));
                    var newInvoice = {
                        ...invoice,
                        percentFinish,
                    };
                    return newInvoice;
                })
            );

            res.render("seller/bill", {
                ...authMiddleware.userInfor(req),
                invoices: invoices,
                course,
            });
        } catch (e) {
            console.log(e);
            next(e);
        }
    }
    // add Course demo
    async addCourses1(req, res, next) {
        try {
            const category = await Category.find({});
            var courses = await Course.find({});
            res.render("seller/create1", {
                ...authMiddleware.userInfor(req),
                categories: category,
            });
        } catch (e) {
            console.log(e);
            next(e);
        }
    }
    // create courses of seller
    // [POST] seller/courses/create1
    async sellerCreate1(req, res, next) {
        const formData = req.body;
        const userInfor = authMiddleware.userInfor(req);
        try {
            if (userInfor.id == null)
                throw { message: "Bạn phải đăng nhập trước", status: 401 };
            var newCourses = new Course({
                categories_id: formData.categories_id,
                user_id: userInfor.id,
                name: formData.name,
                image: formData.imageId,
                shortDescription: formData.shortDescription,
                description: formData.Description,
                price: formData.price,
                isValidated: false,
            });
            // res.json(newCourses);
            await newCourses.save();
            const id = await newCourses._id;
            Course.find({}, (err, data) => {
                if (!err) {
                    res.redirect(`/seller/courses/create/2/${id}`);
                }
            });
        } catch (e) {
            console.log(e);
            next(e);
        }
    }
    // add Video Course
    async addCourses2(req, res, next) {
        try {
            var course = await Course.find({ _id: req.params.courseid });
            var lessons = await Lesson.find({ course_id: req.params.courseid });
            res.render("seller/create2", {
                ...authMiddleware.userInfor(req),
                lessons: lessons,
                course: course,
                // courses: mutipleMongooseToObject(courses),
            });
        } catch (e) {
            console.log(e);
            next(e);
        }
    }
    // [POST] seller/courses/create2
    async sellerCreate2(req, res, next) {
        const formData = req.body;
        try {
            var newLessons = new Lesson({
                course_id: req.params.courseid,
                urlVideo: formData.urlVideo,
                title: formData.title,
                // order:
                isFinish: false,
            });
            // res.json(newLessons);
            await newLessons.save();
            Lesson.find({}, (err, data) => {
                if (!err && formData?.isEdit) {
                    res.redirect(`/seller/courses/${req.params.courseid}/edit`);
                }
                if (!formData?.isEdit) {
                    res.redirect(`/seller/courses/create/2/${req.params.courseid}`);
                }
            });
        } catch (e) {
            console.log(e);
            next(e);
        }
    }
    // add Question Course
    async addCourses3(req, res, next) {
        try {
            var course = await Course.find({ _id: req.params.courseid });
            var lessons = await Lesson.find({ course_id: req.params.courseid });
            var questions = await Question.find({ course_id: req.params.courseid });
            res.render("seller/create3", {
                ...authMiddleware.userInfor(req),
                lessons: lessons,
                course: course,
                questions: questions,
                // courses: mutipleMongooseToObject(courses),
            });
        } catch (e) {
            console.log(e);
            next(e);
        }
    }
    // [POST] seller/courses/create3
    async sellerCreate3(req, res, next) {
        const formData = req.body;
        try {
            var newQuestions = new Question({
                course_id: req.params.courseid,
                question: formData.question,
                a: formData.aAnswer,
                b: formData.bAnswer,
                c: formData.cAnswer,
                d: formData.dAnswer,
                // order:
                trueAnswer: formData.trueAnswer,

            });
            await newQuestions.save();
            Question.find({}, (err, data) => {
                if (!err && formData?.isEdit) {
                    res.redirect(`/seller/courses/create/3/${req.params.courseid}`);
                }
                if (!formData?.isEdit) {
                    res.redirect(`/seller/courses/${req.params.courseid}/edit`);
                }
            });
        } catch (e) {
            console.log(e);
            next(e);
        }
    }
    // edit Course demo
    async editCourses(req, res, next) {
        let CourseId = req.params.courseid;
        try {
            let category = await Category.find({});
            category = category.map((item) => {
                return {
                    nameCategory: item.nameCategory,
                    _id: item._id.toString(),
                };
            });
            var course = await Course.find({ _id: CourseId });
            const lessons = await Lesson.find({ course_id: course[0]._id });
            const questions = await Question.find({ course_id: course[0]._id });
            course = {
                _id: course[0]._id,
                user_id: course[0].user_id,
                name: course[0].name,
                image: course[0].image,
                shortDescription: course[0].shortDescription,
                description: course[0].description,
                price: course[0].price,
                categories_id: course[0].categories_id.toString(),
            };

            res.render("seller/edit", {
                ...authMiddleware.userInfor(req),
                categories: category,
                course: course,
                lessons: lessons,
                questions: questions,
            });
        } catch (err) {
            console.log(err);
            next(e);
        }
    }
    async updateCoursesOfSeller(req, res, next) {
        const formData = req.body;
        const userInfor = authMiddleware.userInfor(req);
        try {
            if (userInfor.id == null)
                throw { message: "Bạn phải đăng nhập trước", status: 401 };
            await Course.updateOne({ _id: req.params.courseid }, formData);
            res.redirect("/seller/");
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
    // [GET] /seller/courses/create/2/:id/edit
    async editVideo(req, res, next) {
        try {
            var lessons = await Lesson.find({ _id: req.params.lessonid });
            res.render("seller/edit2.ejs", {
                ...authMiddleware.userInfor(req),
                lessons: lessons,
            });
        } catch (e) {
            console.log(e);
            next(e);
        }
    }
    async updateVideo(req, res, next) {
        try {
            const lessons = await Lesson.find({ _id: req.params.lessonid });
            const { title, urlVideo } = req.body;
            await Lesson.findOneAndUpdate(
                { _id: Number(req.params.lessonid) },
                { urlVideo, title, isFinish: false }
            );
            lessons.map((les) => {
                const courseId = les.course_id;
                if (req.body.isEdit) {
                    res.redirect(`/seller/courses/${courseId}/edit`);
                } else {
                    res.redirect(`/seller/courses/create/2/${courseId}`);
                }
            });
        } catch (e) {
            console.log(e.message);
            next(e);
        }
    }
    // [DELETE] /seller/courses/create/2/:id
    async destroy(req, res, next) {
        try {
            const lessons = await Lesson.find({ _id: req.params.lessonid });
            await Lesson.findByIdAndDelete({ _id: req.params.lessonid });
            if (req.query.edit) {
                lessons.map((les) => {
                    const id = les.course_id;
                    res.redirect(`/seller/courses/${id}/edit`);
                });
            } else {
                lessons.map((les) => {
                    const id = les.course_id;
                    res.redirect(`/seller/courses/create/2/${id}`);
                });
            }
        } catch (e) {
            console.log(e);
            next(e);
        }
    }
    // [GET] /seller/courses/create/3/:id/edit
    async editQuestion(req, res, next) {
        try {
            var questions = await Question.find({ _id: req.params.questionid });
            res.render("seller/edit3.ejs", {
                ...authMiddleware.userInfor(req),
                questions: questions,
            });
        } catch (e) {
            console.log(e);
            next(e);
        }
    }
    // [PUT] /seller/courses/create/3/:id
    async updateQuestion(req, res, next) {
        try {
            const questions = await Question.find({ _id: req.params.questionid });
            const { question, a, b, c, d, trueAnswer } = req.body;
            await Question.findOneAndUpdate(
                { _id: req.params.questionid },
                { question, a, b, c, d, trueAnswer }
            );
            questions.map((ques) => {
                const id = ques.course_id;
                if (req.body.isQuestionEdit) {
                    res.redirect(`/seller/courses/${id}/edit`);
                } else {
                    res.redirect(`/seller/courses/create/3/${id}`);
                }
            });
        } catch (e) {
            console.log(e.message);
            next(e);
        }
    }
    // [DELETE] /seller/courses/create/3/:id
    async destroyQuestion(req, res, next) {
        try {
            const questions = await Question.find({ _id: req.params.questionid });
            await Question.findByIdAndDelete({ _id: req.params.questionid });
            if (req.query.edit) {
                questions.map((ques) => {
                    const id = ques.course_id;
                    res.redirect(`/seller/courses/${id}/edit`);
                });
            } else {
                questions.map((ques) => {
                    const id = ques.course_id;
                    res.redirect(`/seller/courses/create/3/${id}`);
                });
            }
        } catch (e) {
            console.log(e);
            next(e);
        }
    }
}
module.exports = new SellerController();
