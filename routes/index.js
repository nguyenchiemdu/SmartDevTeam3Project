var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var courses = db.get('courses')
  var skills = db.get('skills')
  res.render('index', { 
    course: courses.value(),
    skill: skills.value()
   });

});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login Page' });
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register Page' });
});

router.get('/password', function(req, res, next) {
  res.render('password', { title: 'Password Page' });
});

router.get('/courses-view', function(req, res, next) {
  res.render('courses-view', { title: 'courses-view' });
});


// router.get('stored/courses', function(req, res, next) {
//   res.render('stored-courses', { title: 'stored-courses' });
// });

module.exports = router;
