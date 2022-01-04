var express = require("express");
var router = express.Router();
var siteController = require("../controllers/SiteController");
var courseController = require("../controllers/CourseController");
/* GET home page. */
router.get("/", siteController.home);

router.get("/login", siteController.login);

router.get("/register", siteController.register);

router.get("/courses/:slug", courseController.show);

router.get("/courses", siteController.courses);
// chưa đăng nhập chưa thể vào trang đổi pass
router.get("/password", siteController.password);

router.get("/cart", siteController.cart);

router.get("/cart/checkout", siteController.checkout);

router.get("/learning", siteController.learning);
// router.get('stored/courses', function(req, res, next) {
//   res.render('stored-courses', { title: 'stored-courses' });
// });

module.exports = router;
