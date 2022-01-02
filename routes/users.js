var express = require("express");
var router = express.Router();

const userController = require("../controllers/userController");

router.post("/register", userController.register);

router.post("/login", userController.login);

router.patch("/password", userController.password);

// show info user, update info, show my courses
// router.get("/",controller)

module.exports = router;
