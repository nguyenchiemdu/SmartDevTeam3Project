var express = require("express");
var router = express.Router();

const siteController = require("../controllers/SiteController");
const tableController = require("../controllers/TableController");

// siteController.index
router.get("/", siteController.home_seller);

router.get("/courses", siteController.show);

router.get("/courses/create/1", siteController.addCourses1);

router.post("/courses/create/1", siteController.sellerCreate);

router.get("/courses/create/2", siteController.addCourses2);

router.post("/courses/create/2");

router.get("/courses/bill", siteController.billCourses);

router.get("/courses/id/edit", siteController.editCourses);

router.get("/courses/:id", tableController.edit);

router.put("/courses/:id", tableController.update);

router.delete("/courses/:id", tableController.destroy);

module.exports = router;
