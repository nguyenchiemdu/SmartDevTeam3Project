var express = require('express');
var router = express.Router();

const meController = require('../controllers/MeController');

router.get('/stored/courses', meController.storedCourses)


module.exports = router;
