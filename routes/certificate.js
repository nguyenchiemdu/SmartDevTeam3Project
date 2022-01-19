var express = require("express");
var router = express.Router();

const certificateController = require("../controllers/CertificateController");

router.get("/", certificateController.certificate);

module.exports = router;
