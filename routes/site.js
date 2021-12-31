var express = require('express');
var router = express.Router();
var siteController = require('../controllers/SiteController')
/* GET home page. */
router.get('/', siteController.home);

router.get('/login', siteController.login);

router.get('/register',siteController.register );

router.get('/password', siteController.password);


// router.get('stored/courses', function(req, res, next) {
//   res.render('stored-courses', { title: 'stored-courses' });
// });


module.exports = router;
