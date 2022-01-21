var express = require("express");
var router = express.Router();
var siteController = require("../controllers/SiteController");
var courseController = require("../controllers/CourseController");
/* GET home page. */
// router.get("/", siteController.home);
// Route này để chứa những chức năng cần phải đăng nhập 


router.get("/success",siteController.success)

router.get("/courses/:slug", courseController.show);

router.get("/password", siteController.password);

router.put("/cart",siteController.addCoursesToUserCart);

router.delete("/cart",siteController.deleteCourseToUserCart);

router.get("/usercart",siteController.getUserCart)

router.get("/cart/checkout", siteController.checkout);

router.post("/cart/payment",siteController.payment);

router.post("/cart/paypal",siteController.paymentPaypal);
// ???? sao lại render trang result ở trong route
router.get("/result", siteController.payment_success);

router.get("/result/paypal", siteController.payment_paypal_success);

router.get("/error", siteController.payment_error);

router.get("/learning", siteController.learning);

router.get("/learning/:id", siteController.userLearning);

router.post("/learning/:id", siteController.postComment);

router.post("/learning/lesson/:lessonid", siteController.trackUser);

router.get("/certification", siteController.certification);


module.exports = router;
