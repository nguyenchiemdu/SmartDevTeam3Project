var siteRouter = require('./site');
var usersRouter = require('./users');
var meRouter = require('./me');
var coursesRouter = require('./courses');

function route(app) {
  app.use('/', siteRouter);
  app.use('/users', usersRouter);
  app.use('/me', meRouter);
  app.use('/courses', coursesRouter);
}

module.exports = route;
