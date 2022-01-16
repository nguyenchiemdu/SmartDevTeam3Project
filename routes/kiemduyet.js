var express = require("express");
var router = express.Router();

const adminController = require("../controllers/AdminController");

router.patch('/:id',adminController.confirm);
router.get("/:slug", adminController.viewDetail);

module.exports = router;
