var express = require("express");
var router = express.Router();

const siteController = require("../controllers/SiteController");
const tableController = require("../controllers/TableController");

// siteController.index
router.get("/", siteController.home_seller);

router.get("/courses", siteController.show);

router.get("/courses/:id", siteController.billCourses);

router.get("/courses/create/1", siteController.addCourses1);

router.post("/courses/create/1", siteController.sellerCreate1);

router.get("/courses/create/2/:id", siteController.addCourses2);

router.post("/courses/create/2/:id", siteController.sellerCreate2);

router.get("/courses/create/3/:id", siteController.addCourses3);

router.post("/courses/create/3/:id", siteController.sellerCreate3);

router.get("/courses/:id/edit", siteController.editCourses);

router.patch("/courses/:id", siteController.updateCoursesOfSeller);

router.get("/course/create/2/:id/edit", siteController.editVideo);

router.put("/course/create/2/:id/edit", siteController.updateVideo);

router.get("/course/create/2/:id/delete", siteController.destroy);

router.get("/course/create/3/:id/edit", siteController.editQuestion);

router.put("/course/create/3/:id/edit", siteController.updateQuestion);

router.get("/course/create/3/:id/delete", siteController.destroyQuestion);

router.get("/courses/:id", tableController.edit);

router.put("/courses/:id", tableController.update);

router.delete("/courses/:id", tableController.destroy);

module.exports = router;
