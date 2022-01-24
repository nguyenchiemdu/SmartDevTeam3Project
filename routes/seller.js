var express = require("express");
var router = express.Router();
var sellerMiddleware = require("../middlerwares/seller.middleware")

const sellerController = require("../controllers/SellerController");
const tableController = require("../controllers/TableController");

// sellerController.index
router.get("/", sellerController.home_seller);

router.get("/courses", sellerController.show);

router.get("/courses/:id",sellerMiddleware.authenSeller, sellerController.billCourses);

router.get("/courses/create/1", sellerController.addCourses1);

router.post("/courses/create/1", sellerController.sellerCreate1);

router.get("/courses/create/2/:id", sellerController.addCourses2);

router.post("/courses/create/2/:id", sellerController.sellerCreate2);

router.get("/courses/create/3/:id", sellerController.addCourses3);

router.post("/courses/create/3/:id", sellerController.sellerCreate3);

router.get("/courses/:id/edit", sellerController.editCourses);

router.patch("/courses/:id", sellerController.updateCoursesOfSeller);

router.get("/course/create/2/:id/edit", sellerController.editVideo);

router.put("/course/create/2/:id/edit", sellerController.updateVideo);

router.get("/course/create/2/:id/delete", sellerController.destroy);

router.get("/course/create/3/:id/edit", sellerController.editQuestion);

router.put("/course/create/3/:id/edit", sellerController.updateQuestion);

router.get("/course/create/3/:id/delete", sellerController.destroyQuestion);

// router.get("/courses/:id", tableController.edit);

// router.put("/courses/:id", tableController.update);

// router.delete("/courses/:id", tableController.destroy);

module.exports = router;
