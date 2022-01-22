var express = require("express");
var router = express.Router();

const certificateController = require("../controllers/CertificateController");

router.get("/:id", certificateController.certificate);

module.exports = router;
