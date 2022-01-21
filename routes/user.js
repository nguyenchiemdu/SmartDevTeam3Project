var express = require("express");
var router = express.Router();

const userController = require("../controllers/UserController");

router.get("/edit-profile", userController.editProfile);
router.patch('/:id',userController.confirmEdit);

router.get("/", userController.show);

module.exports = router;
