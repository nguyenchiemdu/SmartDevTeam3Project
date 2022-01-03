var express = require("express");
var router = express.Router();

const authController = require("../controllers/AuthController");

router.post("/register", authController.register);

router.post("/login", authController.login);

router.patch("/password", authController.password);

router.get("/signout",authController.signout);

// show info user, update info, show my courses
// router.get("/",controller)

module.exports = router;
