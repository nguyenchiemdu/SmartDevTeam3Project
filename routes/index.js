var siteRouter = require("./site");
var authRouter = require("./auth");
var adminRouter = require("./admin");
var sellerRouter = require("./seller");

// Middleware này để tạm thời thêm dấu / vào route, fix một vài lỗi tạm thời
function redirect(req,res,next) {
  if (req.originalUrl == '/admin')  return res.redirect("/admin/")
  next()
}

function route(app) {
  app.use("/", siteRouter);
  app.use("/auth", authRouter);
  app.use("/admin",redirect, adminRouter);
  app.use("/seller", sellerRouter);
}

module.exports = route;
