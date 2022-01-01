var siteRouter = require("./site");
var usersRouter = require("./users");
var adminRouter = require("./admin");
var sellerRouter = require("./seller");


function route(app) {
  app.use("/", siteRouter);
  app.use("/users", usersRouter);
  app.use("/admin", adminRouter);
  app.use("/seller", sellerRouter);
}

module.exports = route;
