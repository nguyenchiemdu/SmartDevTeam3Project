var express = require("express");
var router = express.Router();

const tableController = require("../controllers/TableController");
const adminController = require("../controllers/AdminController");

// siteController.index
router.get("/", adminController.show);

router.get("/:table", tableController.showTable);

router.get("/:table/create", tableController.create);

router.post("/:table/store", tableController.store);

router.get("/:table/:id", tableController.edit);

router.put("/:table/:id", tableController.update);

router.delete("/:table/:id", tableController.destroy);

router.get("/:table/:slug", tableController.show);

module.exports = router;
