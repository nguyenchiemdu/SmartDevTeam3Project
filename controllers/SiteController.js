require("dotenv").config();
const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const { mutipleMongooseToObject } = require("../utilities/mongoose");
const jwt = require("jsonwebtoken");
var authMiddleware = require("../middlerwares/auth.middleware");
const mongoose = require("mongoose");
const Category = require("../models/Category");
const Invoice = require("../models/Invoice");
const UserCart = require("../models/UserCart");
const Note = require('../models/Note');
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const paypal = require("paypal-rest-sdk");
// const paypal = Paypal(process.env.PAYPAL_SECRET_KEY);
const UserCourse = require("../models/UserCourse");
const UserLesson = require("../models/UserLesson");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Comment = require("../models/Comment");
const Question = require("../models/Question");
var url = require("url");
const { monkeyLearnAnalysis } = require("../utilities/monkeyLearn");
var resultPayment, totalSumCart, userNow;
const { copy } = require("../app");
const { userInfor } = require("../middlerwares/auth.middleware");
const axios = require("axios").default;
var ytDurationFormat = require("youtube-duration-format");
paypal.configure({
    mode: "sandbox", //sandbox or live
    client_id:
        "Af28FeslwhxWrQgkN15xEqGK6kUviwhpg1uc7SvOpQSHL1SWywAqBdpSDpQlPFSlkeyb6M2aolPeJjo-",
    client_secret:
        "EP3Xp3p9mUMiyDeXRsv-lL4eKEzpG5lnHBJZwHWeyHOZur-FBycdsG387jVOGNGEK7ZquOWvr4AhHgtB",
});

const pagination = async (
    req,
    Table,
    pageSize,
    populateString,
    findCondition
) => {
    try {
        let page = req.query.page || 1;
        return await Table.find(findCondition)
            .skip(pageSize * page - pageSize)
            .limit(pageSize)
            .populate(populateString)
            .exec()
            .then(async (docs) => {
                var countResult;
                let pages = await Table.countDocuments(findCondition).then((count) => {
                    // đếm để tính xem có bao nhiêu trang
                    countResult = count;
                    let pages = Math.ceil(count / pageSize);
                    return pages;
                });
                return { docs, page, pages, countResult };
            });
    } catch (e) {
        console.log(e);
        next(e);
    }
};
const getYoutubeVideoDuration = async (videoId) => {
    var result = await axios
        .get(
            `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=AIzaSyDR5YdTOMZJ43q47od7XVSGLfjQCRNwegA`
        )
        .then((response) => {
            var youtubeTime = response.data.items[0].contentDetails.duration;
            var duration = ytDurationFormat(youtubeTime);
            return duration;
        })
        .catch(function (error) {
            console.log(error);
        });
    return result;
};

class SiteController {
    // GET /
    async home(req, res, next) {
        try {
            var data = await Promise.all([
                Course.find({ isValidated: 1 }),
                Category.find({}),
            ]);
            res.render("index.ejs", {
                ...authMiddleware.userInfor(req),
                courses: mutipleMongooseToObject(data[0]),
                categories: mutipleMongooseToObject(data[1]),
            });
        } catch (e) {
            console.log(e);
            next(e);
        }
    }
    // [GET] /courses
    async courses(req, res, next) {
        try {
            const pageSize = 8;
            let result = await pagination(req, Course, pageSize, "", {
                isValidated: 1,
            }).then((res) => res);
            // const validatedCourse = result.docs.filter((item) => item.isValidated === 1);
            res.render("courses-view.ejs", {
                ...authMiddleware.userInfor(req),
                courses: result.docs, // sản phẩm trên một paga
                current: result.page, // page hiện tại
                pages: result.pages, // tổng số các page
            });
        } catch (e) {
            console.log(e);
            next(e);
        }
    }
    async learning(req, res, next) {
        try {
            let pageSize = 4;
            let userInfor = authMiddleware.userInfor(req);
            if (userInfor.username == null)
                throw { message: "Bạn phải đăng nhập trước", status: 401 };
            let userCourses = await UserCourse.find({ user_id: userInfor.id })
                .populate("course_id")
                .exec()
                .then((userCourses) => {
                    let courses =
                        userCourses.length < 1
                            ? []
                            : userCourses.map((course) => course.course_id);
                    return courses;
                });

            // console.log(userCourses);
            userCourses = await Promise.all(
                userCourses.map(async (course) => {
                    var lessons = await Lesson.find({ course_id: course._id });
                    var userLesson = await UserLesson.find({ user_id: userInfor.id });

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
                    course = JSON.parse(JSON.stringify(course));
                    var newCourse = {
                        ...course,
                        percentFinish,
                    };

                    return newCourse;
                })
            );
            res.render("learning.ejs", {
                ...authMiddleware.userInfor(req),
                courses: userCourses,
            });
        } catch (e) {
            next(e);
        }
    }
    async userLearning(req, res, next) {
        try {
            let userInfor = authMiddleware.userInfor(req);
            if (userInfor.id == null)
                throw { message: "Bạn phải đăng nhập trước", status: 401 };
            let courseId = req.params.id;
            let course = await Course.findOne({ _id: courseId });

            // kiem tra xem user da mua khoa nay chua
            let usercourse = await UserCourse.findOne({
                user_id: userInfor.id,
                course_id: courseId
            });
            if (usercourse == null) throw { message: "Bạn chưa mua khoá học này", status: 403 }
            let videoId = req.query.videos;
            if (videoId == null) {
                var lesson = await Lesson.findOne({ course_id: courseId });
                if (lesson == null)
                    throw { message: "Khoá học này chưa khả dụng", status: 403 };
                return res.redirect(`/learning/${req.params.id}?videos=${lesson._id}`);
            }
            var lessons = await Lesson.find({ course_id: courseId });
            lessons = await Promise.all(
                lessons.map(async (lesson) => {
                    let duration = await getYoutubeVideoDuration(lesson.urlVideo);
                    // console.log(duration);
                    var newLesson = { ...JSON.parse(JSON.stringify(lesson)), duration };
                    return newLesson;
                })
            );
            var userLesson = await UserLesson.find({ user_id: userInfor.id });
            const filterLesson = userLesson.filter((user) => {
                return lessons.some((lesson) => user.lesson_id == lesson._id);
            });

            const sumCountLesson = lessons.length;

            const countCheckLesson = filterLesson.filter(
                (userLes) => userLes.isFinish == true || userLes.isFinish == false
            );

            //tim cac lesson da hoc
            const countFinish = filterLesson.filter(
                (userLes) => userLes.isFinish == true
            );
            const sumFinish = countFinish.length;
            let mapIsFisnish = {};
            countCheckLesson.forEach((userlesson) => {
                mapIsFisnish[userlesson.lesson_id] = userlesson.isFinish;
            });

            //tinh phan tram cua lesson da hoc
            var percentFinish;
            if (sumFinish == 0 && sumCountLesson == 0) {
                percentFinish = 0;
            } else {
                percentFinish = (sumFinish / sumCountLesson) * 100;
            }

            // kiem tra da xem hêt bai hoc hay chua?
            const findAllCourseNotFinished = countFinish.filter(
                (userLes) => userLes.isFinish
            );

            let hasAllFinished = (findAllCourseNotFinished.length === sumCountLesson) ? true : false
            var doc = await UserCourse.findOne({
                user_id: userInfor.id,
                course_id: courseId,
                isCompleted: 1,
            })
            let isTested = (doc !== null) ? true : false

            let currentLesson;
            let current = 0;
            for (let i = 0; i < lessons.length; i++) {
                if (lessons[i]._id == videoId) {
                    current = i;
                }
            };
            currentLesson = lessons[current];
            if (current > 0 && mapIsFisnish[lessons[current - 1]._id] != true) throw { message: "Bạn chưa được phép học bài này", status: 403 };
            var userTracking = await UserLesson.findOne({
                user_id: userInfor.id,
                lesson_id: currentLesson._id,
            });
            if (userTracking == null) userTracking = {};
            let commentUser = await Comment.find({ course_id: courseId })
                .populate("user_id")
                .exec()
                .then((commentUser) => {
                    return commentUser;
                });
            // Note
            const notes = await Note.find({ lesson_id: currentLesson._id, user_id: userInfor.id }).populate("lesson_id");
            res.render("userLearning/user-learning.ejs", {
                progress: userTracking.progress == null ? 0 : userTracking.progress,
                rawData: userTracking.rawData == null ? [] : userTracking.rawData,
                lessons,
                courseId,
                currentLesson,
                course,
                userLesson,
                sumCountLesson,
                sumFinish,
                percentFinish,
                countFinish,
                countCheckLesson,
                mapIsFisnish,
                notes,
                // checkFinish,
                commentUser,
                userTracking,
                hasAllFinished,
                isTested,
                courseId,
                ...authMiddleware.userInfor(req),
            });
        } catch (e) {
            console.log(e);
            next(e);
        }
    }


    async question(req, res, next) {
        try {
            let courseId = req.params.id;
            console.log(courseId);
            let questions = await Question.find({ course_id: courseId });
            console.log(questions);
            console.log();

            res.render("question.ejs",
                {
                    ...authMiddleware.userInfor(req),
                    questions,
                    courseId
                });
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    async postQuestion(req, res, next) {
        try {
            const formData = req.body;

            const userInfor = authMiddleware.userInfor(req);
            let courseId = req.params.id;
            let countListTrueAnswers = 0;
            let questions = await Question.find({ course_id: courseId });
            console.log(formData);
            questions.forEach(question => {
                if (formData[question._id] == question.trueAnswer) {
                    countListTrueAnswers++;
                }
            });
            let isPassed = countListTrueAnswers / questions.length >= 0.8 ? true : false;
            if (isPassed) {
                var CourseCompleted = await UserCourse.findOne({
                    user_id: userInfor.id,
                    course_id: courseId,
                })
                CourseCompleted.isCompleted = 1;
                await CourseCompleted.save();
            }

            res.render("question-success.ejs",
                {
                    ...authMiddleware.userInfor(req),
                    isPassed,

                });
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    //Post Comment
    async postComment(req, res, next) {
        const formData = req.body;
        const userInfor = authMiddleware.userInfor(req);
        let courseId = req.params.id;
        let videoId = req.query.videos;
        try {
            if (userInfor.id == null) throw "Bạn phải đăng nhập trước!";
            // Sentiment analysis comment
            const resultAnalysis = await monkeyLearnAnalysis(formData.comment);
            var newComment = new Comment({
                user_id: userInfor.id,
                course_id: courseId,
                commentContent: formData.comment,
                analyzeComment: resultAnalysis,
            });
            await newComment.save();
            res.redirect(`/learning/${courseId}?video=${videoId}`);
        } catch (e) {
            console.log(e);
            res.json(e);
        }
    }

    async trackUser(req, res, next) {
        try {
            let courseId = req.params.courseId;
            var userInfor = authMiddleware.userInfor(req);
            if (userInfor.id == null)
                throw { message: "Bạn phải đăng nhập trước", status: 401 };
            var doc = await UserLesson.findOne({
                user_id: userInfor.id,
                lesson_id: req.params.lessonid,
            });
            if (doc == null)
                doc = new UserLesson({
                    user_id: userInfor.id,
                    lesson_id: req.params.lessonid,
                });
            doc.progress = req.body.progress;
            doc.rawData = req.body.rawData;
            let sumWatchedSecond = 0;
            doc.rawData.forEach(segment => {
                sumWatchedSecond = sumWatchedSecond + segment.end - segment.start + 1;
            });

            if (sumWatchedSecond / req.body.duration > 0.8) doc.isFinish = true;
            // else doc.isFinish = false;
            await doc.save();
            res.json({ kq: "Thanh cong" });
        } catch (e) {
            console.log(e);
            next(e);
        }
    }
    async search(req, res, next) {
        const pageSize = 4;
        try {
            const searchName = req.query.name;
            let result = await pagination(req, Course, pageSize, "", {
                name: { $regex: searchName, $options: "i" },
            });

            res.render("searchPage.ejs", {
                personSearch: mutipleMongooseToObject(result.docs),
                current: result.page, // page hiện tại
                pages: result.pages,
                searchName: searchName,
                countSearch: result.countResult,
                ...authMiddleware.userInfor(req),
            });
        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    // [GET] / login
    login(req, res, next) {
        const userInfor = authMiddleware.userInfor(req);
        if (userInfor.username != null) return res.redirect("/");
        res.render("login", {
            title: "Login Page",
            ...authMiddleware.userInfor(req),
        });
    }

    //GET /register
    register(req, res, next) {
        res.render("register", {
            title: "Register Page",
            ...authMiddleware.userInfor(req),
        });
    }

    //GET /success
    success(req, res, next) {
        res.render("register-success", {
            title: "Success",
            ...authMiddleware.userInfor(req),
        });
    }

    //GET /password
    password(req, res, next) {
        res.render("password", {
            title: "Password Page",
            ...authMiddleware.userInfor(req),
        });
    }
    //GET /cart
    async cart(req, res, next) {
        const userInfor = authMiddleware.userInfor(req);
        // console.log(userInfor)
        try {
            var coursesInCart =
                userInfor.username == null
                    ? []
                    : await UserCart.find({ user_id: userInfor.id })
                        .populate("course_id")
                        .exec()
                        .then((userCart) => {
                            let courses = userCart.map((course) => course.course_id);
                            return courses;
                        })
                        .catch((e) => console.log(e));
            res.render("shopping-cart", {
                title: "Cart",
                ...userInfor,
                courses: coursesInCart,
            });
        } catch (e) {
            res.json(e);
            next(e);
        }
    }
    async checkout(req, res, next) {
        const userInfor = authMiddleware.userInfor(req);
        const getEmail = await User.findOne({ _id: userInfor.id });
        try {
            if (userInfor.id == null) throw { message: "Bạn phải đăng nhập trước", status: 401 }
            var infoCheckout =
                userInfor.username == null
                    ? null
                    : await UserCart.find({ user_id: userInfor.id })
                        .populate("course_id")
                        .exec()
                        .then((userCart) => {
                            let sum = 0;
                            var courses = userCart.map((course) => course.course_id);
                            userCart.forEach(
                                (item) => (sum += parseFloat(item.course_id.price))
                            );
                            return { sum, courses };
                        })
                        .catch((e) => console.log(e));
            if (getEmail.email == '') throw { message: "Bạn phải cập nhật thông tin trong profile trước", status: 403 };
            if (infoCheckout != null) {
                if (infoCheckout.sum != 0)
                    return res.render("checkout", {
                        courses: infoCheckout.courses,
                        sumPrice: infoCheckout.sum,
                        email: getEmail.email,
                        title: "Check Out",
                        ...authMiddleware.userInfor(req),
                    })
                else throw { message: "Bạn chưa có khoá học nào trong giỏ hàng!", status: 404 };

            }
            throw { message: "Bạn phải đăng nhập trước", status: 401 };
        } catch (e) {
            next(e);
            console.log(e);
        }
    }

    // Payment checkout to striped
    // [Post] /cart/payment
    async payment(req, res, next) {
        const userInfor = authMiddleware.userInfor(req);
        const { email, number, exp_month, exp_year, cvc } = req.body;
        var sumPrice =
            userInfor.username == null
                ? null
                : await UserCart.find({ user_id: userInfor.id })
                    .populate("course_id")
                    .exec()
                    .then((userCart) => {
                        let sum = 0;
                        userCart.forEach(
                            (item) => (sum += parseFloat(item.course_id.price))
                        );
                        return sum;
                    })
                    .catch((e) => console.log(e));
        try {
            // Create token check valid card
            const token = await stripe.tokens.create({
                card: {
                    number,
                    exp_month,
                    exp_year,
                    cvc,
                },
            });
            // Create customer to save email customer to show in bill
            const customer = await stripe.customers.create({
                email,
                source: token.id,
            });
            // Create charge method to payment
            const charge = await stripe.charges.create({
                amount: parseFloat(sumPrice) * 100,
                currency: "usd",
                customer: customer.id,
                // Verify your integration in this guide by including this parameter
                metadata: { integration_check: "accept_a_payment" },
                receipt_email: email,
            });
            // Save transaction data value and status
            var transactions = new Transaction({
                user_id: userInfor.id,
                email,
                chargeID: charge.id,
                cartNumber: number,
                price: sumPrice,
                status: "approved",
            });
            // Add course in Mylearning and invoices
            const courseInCart = await UserCart.find({ user_id: userInfor.id })
                .populate("course_id")
                .exec();
            console.log(courseInCart);
            courseInCart.forEach(async (course) => {
                var usercourses = new UserCourse({
                    user_id: userInfor.id,
                    course_id: course.course_id._id,
                });
                var invoices = new Invoice({
                    user_id: userInfor.id,
                    course_id: course.course_id._id,
                    totalPayout: course.course_id.price,
                });
                await usercourses.save();
                await invoices.save();
            });
            await transactions.save();
            // Delete course out of userCart
            await UserCart.deleteMany({ user_id: userInfor.id })
                .then(function () {
                    console.log("Data deleted"); // Success
                })
                .catch(function (error) {
                    console.log(error); // Failure
                });
            res.redirect("/result");
        } catch (err) {
            resultPayment = err.raw.message;
            res.redirect("/error");
        }
    }

    // [Post] /cart/paymentPaypal
    async paymentPaypal(req, res, next) {
        const userInfor = authMiddleware.userInfor(req);
        userNow = userInfor;
        var sumPrice =
            userInfor.username == null
                ? null
                : await UserCart.find({ user_id: userInfor.id })
                    .populate("course_id")
                    .exec()
                    .then((userCart) => {
                        let sum = 0;
                        userCart.forEach(
                            (item) => (sum += parseFloat(item.course_id.price))
                        );
                        return sum;
                    })
                    .catch((e) => console.log(e));
        const sum = sumPrice.toString() + ".00";
        totalSumCart = sumPrice.toString() + ".00";
        // Add course in Mylearning and invoices
        const courseInCart = await UserCart.find({ user_id: userInfor.id })
            .populate("course_id")
            .exec();
        var items = [];
        courseInCart.forEach((course) => {
            var item = {
                name: course.course_id.name,
                price: course.course_id.price.toString() + ".00",
                currency: "USD",
                quantity: "1",
            };
            items.push(item);
        });
        try {
            var create_payment_json = {
                intent: "sale",
                payer: {
                    payment_method: "paypal",
                },
                transactions: [
                    {
                        amount: {
                            currency: "USD",
                            total: sum,
                        },
                        item_list: {
                            items: items,
                        },
                        description: "This is the payment description.",
                    },
                ],
                redirect_urls: {
                    return_url: "/result/paypal",
                    cancel_url: "/error",
                },
            };
            console.log(create_payment_json.transactions[0].item_list);
            paypal.payment.create(create_payment_json, function (error, payment) {
                if (error) {
                    throw error;
                } else {
                    for (let i = 0; i < payment.links.length; i++) {
                        if (payment.links[i].rel == "approval_url") {
                            res.redirect(payment.links[i].href);
                        }
                    }
                }
            });
            // res.redirect("/result/paypal");
        } catch (err) {
            // resultPayment = err.raw.message;
            next(err);
            // res.redirect("/error");
        }
    }

    //POST /coursesid
    async getCoursesFromId(req, res, next) {
        try {
            var courses = await Course.find({
                _id: {
                    $in: req.body.cart.map((id) => mongoose.Types.ObjectId(id)),
                },
            });
            res.json(courses);
        } catch (e) {
            console.log(e);
            next(e);
        }
    }
    // GET /usercart
    async getUserCart(req, res, next) {
        try {
            const userInfor = authMiddleware.userInfor(req);
            if (!userInfor.username)
                res.json({
                    status: "failed",
                });
            else
                res.json({
                    status: "success",
                });
        } catch (e) {
            console(e);
            next(e);
        }
    }
    //PUT /cart
    async addCoursesToUserCart(req, res, next) {
        const userInfor = authMiddleware.userInfor(req);
        if (!userInfor.username) return res.sendStatus(401);

        try {
            var itemData = await UserCart.findOne({
                user_id: userInfor.id,
                course_id: req.body.course_id,
            })
            if (itemData == null) itemData = new UserCart({
                user_id: userInfor.id,
                course_id: req.body.course_id,
            });
            await itemData.save();
            res.json({
                status: "success",
            });
        } catch (e) {
            next(e);
            console.log(e);
        }
    }
    //DELETE /cart
    async deleteCourseToUserCart(req, res, next) {
        const userInfor = authMiddleware.userInfor(req);
        if (!userInfor.username) return res.sendStatus(401);
        // console.log({ user_id: userInfor.id, course_id: req.body.course_id });
        try {
            const result = await UserCart.deleteOne({
                user_id: userInfor.id,
                course_id: req.body.course_id,
            });
            console.log(result);
            res.json({
                status: "success",
            });
        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    payment_success(req, res, next) {
        res.render("payment_success", {
            title: "Payment Success",
            ...authMiddleware.userInfor(req),
        });
    }

    async payment_paypal_success(req, res, next) {
        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;
        const execute_payment_json = {
            payer_id: payerId,
            transactions: [
                {
                    amount: {
                        currency: "USD",
                        total: totalSumCart,
                    },
                },
            ],
        };
        paypal.payment.execute(
            paymentId,
            execute_payment_json,
            async function (error, payment) {
                try {
                    if (error) {
                        console.log(error.response);
                        throw error;
                    } else {
                        console.log(
                            payment.id,
                            payment.state,
                            payment.payer.payer_info.email
                        );
                        console.log(userNow);
                        // Save transaction data value and status
                        var transactions = new Transaction({
                            user_id: userInfor.id,
                            email: payment.payer.payer_info.email,
                            chargeID: payment.id,
                            price: totalSumCart,
                            status: payment.state,
                        });
                        // Add course in Mylearning and invoices
                        const courseInCart = await UserCart.find({ user_id: userNow.id })
                            .populate("course_id")
                            .exec();
                        console.log(courseInCart);
                        courseInCart.forEach(async (course) => {
                            var usercourses = new UserCourse({
                                user_id: userNow.id,
                                course_id: course.course_id._id,
                            });
                            var invoices = new Invoice({
                                user_id: userNow.id,
                                course_id: course.course_id._id,
                                totalPayout: course.course_id.price,
                            });
                            await usercourses.save();
                            await invoices.save();
                        });
                        await transactions.save();
                        // Delete course out of userCart
                        await UserCart.deleteMany({ user_id: userNow.id })
                            .then(function () {
                                console.log("Data deleted"); // Success
                            })
                            .catch(function (error) {
                                console.log(error); // Failure
                            });
                        res.render("payment_success", {
                            title: "Payment Success",
                        });
                    }
                } catch (error) {
                    next(error);
                }
            }
        );
    }

    payment_error(req, res, next) {
        res.render("payment_error", {
            title: "Payment Error",
            error: resultPayment,
            ...authMiddleware.userInfor(req),
        });
    }
}

module.exports = new SiteController();
