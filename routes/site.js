var express = require("express");
var router = express.Router();
var siteController = require("../controllers/SiteController");
var courseController = require("../controllers/CourseController");
/* GET home page. */
// router.get("/", siteController.home);
// Route này để chứa những chức năng k cần đăng nhập 

router.get("/",siteController.home);
router.get("/category", siteController.getCategory);

router.post("/category", siteController.category);

router.get("/login", siteController.login);

router.get("/register", siteController.register);

router.get("/courses/:slug", courseController.show);

router.get("/courses", siteController.courses);

router.get("/cart", siteController.cart);

router.post("/coursesid",siteController.getCoursesFromId);

router.get("/search", siteController.search);

module.exports = router;
