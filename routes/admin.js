var express = require("express");
var router = express.Router();

const tableController = require("../controllers/TableController");
const adminController = require("../controllers/AdminController");

// siteController.index
router.get("/userdisable", adminController.userDisable);

router.patch("/userdisable/:id", adminController.disable);

router.get("/useractive", adminController.userActive);

router.patch("/useractive/:id", adminController.active);

router.get("/kiemduyet", adminController.kiemduyet);

router.get("/signout",adminController.signout);

router.patch('/kiemduyet/:id',adminController.confirm);

router.get("/kiemduyet/:slug", adminController.viewDetail);

router.get("/:table", tableController.showTable);

router.get("/:table/create", tableController.create);

router.post("/:table/create", tableController.store);

router.get("/:table/:id", tableController.edit);

router.put("/:table/:id", tableController.update);

router.delete("/:table/:id", tableController.destroy);

router.get("/", adminController.show);

module.exports = router;
