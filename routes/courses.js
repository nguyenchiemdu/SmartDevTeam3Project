var express = require("express");
var router = express.Router();
var sellerMiddleware = require("../middlerwares/seller.middleware")

const sellerController = require("../controllers/SellerController");
const tableController = require("../controllers/TableController");


router.get("/", sellerController.billCourses);

router.get("/edit", sellerController.editCourses);

router.patch("/", sellerController.updateCoursesOfSeller);

router.get("/lessons/:lessonid/edit", sellerController.editVideo);

router.put("/lessons/:lessonid/edit", sellerController.updateVideo);

router.get("/lessons/:lessonid/delete", sellerController.destroy);

router.get("/questions/:questionid/edit", sellerController.editQuestion);

router.put("/questions/:questionid/edit", sellerController.updateQuestion);

router.get("/questions/:questionid/delete", sellerController.destroyQuestion);

module.exports = router;