var express = require('express');
var router = express.Router();

const userController = require('../controllers/userController');

router.post('/api/password', userController.password)

router.post('/api/login', userController.login)

router.post('/api/register', userController.register)

module.exports = router;
