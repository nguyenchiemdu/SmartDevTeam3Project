var express = require("express");
var router = express.Router();

const siteController = require("../controllers/SiteController");
const tableController = require("../controllers/TableController");

// siteController.index
router.get("/", siteController.home_seller);

router.get("/courses/create", siteController.addCourses);

router.post("/courses/create", siteController.sellerCreate);

router.get("/courses/:id", tableController.edit);

router.put("/courses/:id", tableController.update);

router.delete("/courses/:id", tableController.destroy);



module.exports = router;
