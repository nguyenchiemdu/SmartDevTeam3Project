var express = require("express");
var router = express.Router();
var siteController = require("../controllers/SiteController");
var courseController = require("../controllers/CourseController");

router.get("/", siteController.home);

router.get("/login", siteController.login);

router.get("/register", siteController.register);

router.get("/success",siteController.success)

router.get("/courses/:slug", courseController.show);

router.get("/courses", siteController.courses);

router.get("/cart", siteController.cart);

router.put("/cart",siteController.addCoursesToUserCart);

router.delete("/cart",siteController.deleteCourseToUserCart);

router.post("/coursesid",siteController.getCoursesFromId);

router.get("/usercart",siteController.getUserCart)

router.get("/cart/checkout", siteController.checkout);

router.post("/cart/payment",siteController.payment);

router.post("/cart/paypal",siteController.paymentPaypal);

router.get("/result", siteController.payment_success);

router.get("/result/paypal", siteController.payment_paypal_success);

router.get("/error", siteController.payment_error);

router.get("/learning", siteController.learning);

router.get("/learning/:id", siteController.userLearning);

router.post("/learning/:id", siteController.postComment);

router.get("/learning/:id/question", siteController.question);

router.post("/learning/:id/question", siteController.postQuestion);

router.post("/learning/:courseId/:lessonid", siteController.trackUser);

router.get("/search", siteController.search);

module.exports = router;
