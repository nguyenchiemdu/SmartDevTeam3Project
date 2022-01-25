var express = require("express");
var router = express.Router();
var sellerMiddleware = require("../middlerwares/seller.middleware")

const sellerController = require("../controllers/SellerController");
const tableController = require("../controllers/TableController");

router.get("/", sellerController.home_seller);

router.get("/courses/:courseid",sellerMiddleware.authenSellerCourse, sellerController.billCourses);

router.get("/courses/create/1",sellerMiddleware.authenSellerCourse, sellerController.addCourses1);

router.post("/courses/create/1",sellerMiddleware.authenSellerCourse, sellerController.sellerCreate1);

router.get("/courses/create/2/:courseid",sellerMiddleware.authenSellerCourse, sellerController.addCourses2);

router.post("/courses/create/2/:courseid",sellerMiddleware.authenSellerCourse, sellerController.sellerCreate2);

router.get("/courses/create/3/:courseid",sellerMiddleware.authenSellerCourse, sellerController.addCourses3);

router.post("/courses/create/3/:courseid",sellerMiddleware.authenSellerCourse, sellerController.sellerCreate3);

router.get("/courses/:courseid/edit",sellerMiddleware.authenSellerCourse, sellerController.editCourses);

router.patch("/courses/:courseid",sellerMiddleware.authenSellerCourse, sellerController.updateCoursesOfSeller);

router.get("/courses/:courseid/lessons/:lessonid/edit",sellerMiddleware.authenSellerCourse,sellerMiddleware.authenSellerLesson, sellerController.editVideo);

router.put("/courses/:courseid/lessons/:lessonid/edit",sellerMiddleware.authenSellerCourse,sellerMiddleware.authenSellerLesson, sellerController.updateVideo);

router.get("/courses/:courseid/lessons/:lessonid/delete",sellerMiddleware.authenSellerCourse,sellerMiddleware.authenSellerLesson, sellerController.destroy);

router.get("/courses/:courseid/questions/:questionid/edit",sellerMiddleware.authenSellerCourse,sellerMiddleware.authenSellerQuestion, sellerController.editQuestion);

router.put("/courses/:courseid/questions/:questionid/edit",sellerMiddleware.authenSellerCourse,sellerMiddleware.authenSellerQuestion, sellerController.updateQuestion);

router.get("/courses/:courseid/questions/:questionid/delete",sellerMiddleware.authenSellerCourse,sellerMiddleware.authenSellerQuestion, sellerController.destroyQuestion);

module.exports = router;
