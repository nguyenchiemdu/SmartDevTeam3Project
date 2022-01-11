var express = require("express");
var router = express.Router();
var siteController = require("../controllers/SiteController");
var courseController = require("../controllers/CourseController");
/* GET home page. */
router.get("/", siteController.home);

router.get("/login", siteController.login);

router.get("/register", siteController.register);

router.get("/success",siteController.success)

router.get("/courses/:slug", courseController.show);

router.get("/courses", siteController.courses);
// chưa đăng nhập chưa thể vào trang đổi pass
router.get("/password", siteController.password);

router.get("/cart", siteController.cart);

router.put("/cart",siteController.addCoursesToUserCart);

router.delete("/cart",siteController.deleteCourseToUserCart);

router.post("/coursesid",siteController.getCoursesFromId);

router.get("/usercart",siteController.getUserCart)

router.get("/cart/checkout", siteController.checkout);

router.get("/result", siteController.payment_success);

router.get("/learning", siteController.learning);

router.get("/search", siteController.search);

module.exports = router;
