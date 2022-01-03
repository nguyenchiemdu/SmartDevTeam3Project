var siteRouter = require('./site');
var usersRouter = require('./users');
var meRouter = require('./me');
var coursesRouter = require('./courses');
// var learningRouter = require('./learning');

function route(app) {
  app.use('/', siteRouter);
  app.use('/users', usersRouter);
  app.use('/me', meRouter);
  app.use('/courses', coursesRouter);
  // app.use('/learning', learningRouter);
}

module.exports = route;
