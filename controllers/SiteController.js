require("dotenv").config();
const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const { mutipleMongooseToObject } = require("../utilities/mongoose");
const jwt = require("jsonwebtoken");
var authMiddleware = require("../middlerwares/auth.middleware");
const mongoose = require("mongoose");
const Category = require("../models/Category");
const UserCart = require("../models/UserCart");
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
        if (
          item.name.toLowerCase().indexOf(searchName) !== -1 ||
          item.price.toLowerCase().indexOf(searchName) !== -1
        ) {
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

  //Show courses of seller
  async show(req, res, next) {
    try {
      var courses = await Course.find({});
      res.render("seller/courses.ejs", {
        ...authMiddleware.userInfor(req),
        courses: mutipleMongooseToObject(courses),
      });
    } catch (e) {
      console.log(e);
      res.json(e);
    }
  }

  // add Course demo
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

  // edit Course demo
  async editCourses(req, res, next) {
    try {
      var courses = await Course.find({});
      res.render("seller/edit");
    } catch (err) {
      console.log(err);
    }
  }

  // create courses of seller
  // [POST] seller/course/create
  async sellerCreate(req, res, next) {
    const formData = req.body;
    console.log(formData);
    try {
      const category = await Category.findOne({
        nameCategory: formData.nameCategory,
      });
      console.log("category==", category._id);
      var courses = await Course.find({ categories_id: category._id });
      console.log("courses====", courses);
      courses.save((err, data) => {
        if (err) {
          console.log(err);
        }
      });
      // res.render("seller/home.ejs", {
      //   ...authMiddleware.userInfor(req),
      // });
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
  async cart(req, res, next) {
    const userInfor = authMiddleware.userInfor(req);
    // console.log(userInfor)
    try {
      var coursesInCart =
        userInfor.username == null ? [] :
          await UserCart.find({})
            .populate('course_id')
            .exec()
            .then((userCart) => {
              let courses = userCart.map(course => course.course_id);
              return courses;
            })
            .catch(e => console.log(e));
      res.render("shopping-cart", {
        title: "Cart",
        ...userInfor,
        courses: coursesInCart,
      });
    } catch (e) {
      res.json(e);
      console.log(e);

    }

  }
  checkout(req, res, next) {
    res.render("checkout", {
      title: "Check Out",
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
  //POST /coursesid
  async getCoursesFromId(req, res, next) {
    // console.log(req.body.cart[0]);
    // mongoose.Types.ObjectId('4ed3ede8844f0f351100000c')
    // res.json('ok')
    try {
      var courses = await Course.find({
        _id: {
          $in: req.body.cart.map((id) => mongoose.Types.ObjectId(id)),
        },
      });
      res.json(courses);
    } catch (e) {
      console.log(e);
      res.json(e);
    }
  }
  // GET /usercart
  async getUserCart(req, res, next) {
    try {
      const userInfor = authMiddleware.userInfor(req);
      if (!userInfor.username)
        res.json({
          status: 'failed'
        })
      else res.json({
        status : 'success'
      })
    } catch (e) {
      console(e)
      res.json(e)
    }
  }
  //PUT /cart
  async addCoursesToUserCart(req, res, next) {
    const userInfor = authMiddleware.userInfor(req);
    if (!userInfor.username) return res.sendStatus(401);

    const itemData = new UserCart({ user_id: userInfor.id, course_id: req.body.course_id });
    try {
      await itemData.save();
      res.json({
        status : 'success'
      });
    } catch (e) {
      res.json(e);
      console.log(e);
    }
    // res.json(req.body.course_id)
  }
  //DELETE /cart
  async deleteCourseToUserCart(req,res,next) {
    const userInfor = authMiddleware.userInfor(req);
    if (!userInfor.username) return res.sendStatus(401);
    console.log({ user_id: userInfor.id, course_id: req.body.course_id });
    try {
      const result = await UserCart.deleteOne({ user_id: userInfor.id, course_id: req.body.course_id });
      console.log(result);
      res.json({
        status : 'success'
      })
    } catch (e) {
      console.log(e);
      res.json(e);
    }
  }


  checkout(req, res, next) {
    res.render("checkout", {
      title: "Check Out",
      ...authMiddleware.userInfor(req),
    });
  }
}

module.exports = new SiteController();
