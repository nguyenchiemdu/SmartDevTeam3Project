var siteRouter = require("./site");
var authRouter = require("./auth");
var adminRouter = require("./admin");
var sellerRouter = require("./seller");
var certificateRouter = require("./certificate");
var userRouter = require("./user");
var apiRouter = require("./api");
// Middleware này để tạm thời thêm dấu / vào route, fix một vài lỗi tạm thời
function redirect(req,res,next) {
  if (req.originalUrl == '/admin')  return res.redirect("/admin/")
  next()
}

function route(app) {
  app.use("/", siteRouter); 
  app.use("/auth", authRouter); //Authen Server
  app.use("/admin",redirect, adminRouter);
  app.use("/seller", sellerRouter);
  app.use("/user", userRouter);
  app.use("/certificate/", certificateRouter);
  app.use("/api", apiRouter);
}

module.exports = route;
