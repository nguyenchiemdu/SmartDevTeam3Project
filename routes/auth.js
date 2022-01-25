var express = require("express");
var router = express.Router();

const authController = require("../controllers/AuthController");

router.post("/register", authController.register);

router.post("/login", authController.login);

router.patch("/password", authController.changePassWord);

router.get("/signout",authController.signout);

module.exports = router;
