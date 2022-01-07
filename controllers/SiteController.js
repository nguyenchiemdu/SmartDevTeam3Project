require("dotenv").config();
const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const { mutipleMongooseToObject } = require("../utilities/mongoose");
const jwt = require("jsonwebtoken");
var authMiddleware = require("../middlerwares/auth.middleware");
const mongoose = require('mongoose');
class SiteController {
  // GET /
  async home(req, res, next) {
    //////////
    try {
      var courses = await Course.find({});
      res.render("index.ejs", {
        ...authMiddleware.userInfor(req),
        courses: mutipleMongooseToObject(courses),
      });
    } catch (e) {
      console.log(e);
      res.render(e);
    }
  }
  // [GET] /courses
  async courses(req, res, next) {
    try {
      var courses = await Course.find({});
      res.render("courses-view.ejs", {
        ...authMiddleware.userInfor(req),
        courses: mutipleMongooseToObject(courses),
      });
    } catch (e) {
      console.log(e);
      res.json(e);
    }
  }

  async learning(req, res, next) {
    try {
      var lessons = await Lesson.find({});
      res.render("learning.ejs", {
        ...authMiddleware.userInfor(req),
        lessons: mutipleMongooseToObject(lessons),
      });
    } catch (e) {
      console.log(e);
      res.json(e);
    }
  }

  async search(req, res, next) {
    try {
      const searchName = req.query.name.toLowerCase();
      const courses = await Course.find({});
      const personSearch = [];
      let countSearch = 0;
      courses.forEach((item) => {
        if ((item.name.toLowerCase().indexOf(searchName) !== -1) || (item.price.toLowerCase().indexOf(searchName) !== -1)){
          personSearch.push(item);
          countSearch++;
        }
      });
      res.render("searchPage.ejs", {
        personSearch: mutipleMongooseToObject(personSearch),
        searchName: searchName,
        countSearch: countSearch,
        ...authMiddleware.userInfor(req),
      });
    } catch (e) {
      console.log(e);
      res.json(e);
    }
  }

  async home_seller(req, res, next) {
    try {
      var courses = await Course.find({});
      res.render("seller/home.ejs", {
        ...authMiddleware.userInfor(req),
        courses: mutipleMongooseToObject(courses),
      });
    } catch (e) {
      console.log(e);
      res.json(e);
    }
  }
  
  // add Course demo cua Trinh`
  async addCourses(req, res, next) {
    try {
      var courses = await Course.find({});
      res.render("seller/create", {
        ...authMiddleware.userInfor(req),
        courses: mutipleMongooseToObject(courses),
      });
    } catch (e) {
      console.log(e);
      res.json(e);
    }
  }

  // [GET] / login
  login(req, res, next) {
    const userInfor = authMiddleware.userInfor(req);
    if (userInfor.username != null) return res.redirect("/");
    res.render("login", {
      title: "Login Page",
      ...authMiddleware.userInfor(req),
    });
  }

  //GET /register
  register(req, res, next) {
    res.render("register", {
      title: "Register Page",
      ...authMiddleware.userInfor(req),
    });
  }

  //GET /success
  success(req, res, next) {
    res.render("register-success", {
      title: "Success",
      ...authMiddleware.userInfor(req),
    });
  }

  //GET /password
  password(req, res, next) {
    res.render("password", {
      title: "Password Page",
      ...authMiddleware.userInfor(req),
    });
  }
  //GET /cart
  cart(req, res, next) {
    res.render("shopping-cart", {
      title: "Cart",
      ...authMiddleware.userInfor(req),
    });
  }
  checkout(req, res, next) {
    res.render("checkout", {
      title: "Check Out",
      ...authMiddleware.userInfor(req),
    });
  }

    //GET /password
    password(req, res, next) {
        res.render('password', { title: 'Password Page', ...authMiddleware.userInfor(req) });
    }
    //GET /cart
    cart(req, res, next) {
        res.render("shopping-cart", { title: "Cart", ...authMiddleware.userInfor(req) });
    }
    //POST /cart
    async getCoursesFromId(req, res, next) {
        // console.log(req.body.cart[0]);
        // mongoose.Types.ObjectId('4ed3ede8844f0f351100000c')
        // res.json('ok')
        try {
            var courses = await Course.find(
                {
                    '_id': {
                        $in: req.body.cart.map(id => mongoose.Types.ObjectId(id))
                    }
                }
            )
            res.json(courses)
        } catch (e) {
            console.log(e)
            res.json(e)
        }
    }
    checkout(req, res, next) {
        res.render("checkout", { title: "Check Out", ...authMiddleware.userInfor(req) });
    }
}

module.exports = new SiteController();
