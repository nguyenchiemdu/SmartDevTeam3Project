var siteRouter = require("./site");
var learnerRouter = require("./learner");
var authRouter = require("./auth");
var adminRouter = require("./admin");
var sellerRouter = require("./seller");
var kiemduyetRouter = require("./kiemduyet");
var authMiddleware = require("../middlerwares/auth.middleware");
// Middleware này để tạm thời thêm dấu / vào route, fix một vài lỗi tạm thời
function redirect(req,res,next) {
  if (req.originalUrl == '/admin')  return res.redirect("/admin/")
  next()
}

function route(app) {
  app.use("/auth", authRouter);
  app.use("/admin",redirect, adminRouter);
  app.use("/seller", sellerRouter);
  app.use("/kiemduyet", kiemduyetRouter);
  app.use("/", siteRouter);
  app.use("/", authMiddleware.authenticateUser, learnerRouter);
}

module.exports = route;
