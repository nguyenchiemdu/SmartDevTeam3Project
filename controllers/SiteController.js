require("dotenv").config();
const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const { mutipleMongooseToObject } = require("../utilities/mongoose");
const jwt = require("jsonwebtoken");
var authMiddleware = require("../middlerwares/auth.middleware");
const mongoose = require("mongoose");
const Category = require("../models/Category");
const Invoice = require("../models/Invoice");
const UserCart = require("../models/UserCart");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const UserCourse = require("../models/UserCourse");
const UserLesson = require("../models/UserLesson");
const Transaction = require("../models/Transaction");

var findCourseBySlug, resultPayment;
const { copy } = require("../app");
const { userInfor } = require("../middlerwares/auth.middleware");
class SiteController {
  // GET /
  async home(req, res, next) {
    //////////
    try {
      var data = await Promise.all([Course.find({}), Category.find({})]);
      res.render("index.ejs", {
        ...authMiddleware.userInfor(req),
        courses: mutipleMongooseToObject(data[0]),
        categories: mutipleMongooseToObject(data[1]),
      });
    } catch (e) {
      console.log(e);
      res.render(e);
    }
  }

  // [GET] /courses
  async courses(req, res, next) {
    const pageSize = 4;
    try {
      let page = req.query.page;

      if (page) {
        page = parseInt(page);
        if (page < 1) {
          page = 1;
        }
        let skips = (page - 1) * pageSize;

        Course.find({})
          .skip(skips)
          .limit(pageSize)
          .then((courses) => {
            res.json(courses);
            // res.render("courses-view.ejs", {
            //   ...authMiddleware.userInfor(req),
            //   courses: mutipleMongooseToObject(courses),
            // });
          })
          .catch((err) => {
            console.log(e);
            res.json(e);
          });
      } else {
        // res.redirect("/courses?page=1")
        var courses = await Course.find().skip(0).limit(pageSize);
        // res.json(courses);
        res.render("courses-view.ejs", {
          ...authMiddleware.userInfor(req),
          courses: mutipleMongooseToObject(courses),
        });
      }
    } catch (e) {
      console.log(e);
      res.json(e);
    }
  }
  // [Post] localhost:8080/category
  // Post slug to find ID Category
  async category(req, res, next) {
    findCourseBySlug = req.body.slug;
    res.json(findCourseBySlug);
  }
  // [Get] localhost:8080/category
  // Get course filter by categories
  async getCategory(req, res, next) {
    const findCourse = async () => {
      const k = await Category.findOne({ slug: findCourseBySlug });
      if (k !== null) {
        Course.find({ categories_id: k._id })
          .populate({
            path: "categories_id",
          })
          .exec((err, course) => {
            res.json(course);
          });
      }
    };
    findCourse();
  }

  async learning(req, res, next) {
    try {
      let userInfor = authMiddleware.userInfor(req);
      if (userInfor.username == null)
        return res.json({ error: "Bạn phải đăng nhập trước" });
      let userCourses = await UserCourse.find({ user_id: userInfor.id })
        .populate("course_id")
        .exec()
        .then((userCourses) => {
          let courses =
            userCourses.length < 1
              ? []
              : userCourses.map((course) => course.course_id);
          return courses;
        });

      // console.log(userCourses);
      userCourses = await Promise.all(userCourses.map(async (course) => {
        var lessons = await Lesson.find({ course_id: course._id });
        var userLesson = await UserLesson.find({ user_id: userInfor.id });

        //Loc 2 mang co lessonId giong nhau
        const filterLesson = userLesson.filter(user => {
          return lessons.some(lesson => user.lesson_id == lesson._id)
        });

        //tim tat ca cac lesson cua course
        const countLesson = lessons.filter(countLes => countLes.isFinish == true || countLes.isFinish == false);
        const sumCountLesson = countLesson.length

        //tim cac lesson da hoc
        const countFinish = filterLesson.filter(userLes => userLes.isFinish == true);
        const sumFinish = countFinish.length

        //tinh phan tram cua lesson da hoc
        var percentFinish;
        if (sumFinish == 0 && sumCountLesson == 0) {
          percentFinish = 0;
        }
        else {
          percentFinish = sumFinish / sumCountLesson * 100;
        }
        course = JSON.parse(JSON.stringify(course));
        var newCourse = {
          ...course, percentFinish
        }

        return newCourse;
      }));
      // console.log(userCourses);
      res.render("learning.ejs", {
        ...authMiddleware.userInfor(req),
        courses: (userCourses),
      });
    } catch (e) {
      console.log(e);
      res.json(e);
    }
  }
  async userLearning(req, res, next) {
    let userInfor = authMiddleware.userInfor(req);
    if (userInfor.id == null) res.json({ error: "Ban phai dang nhap truoc" });
    let courseId = req.params.id;
    let videoId = req.query.videos;

    if (videoId == null) {
      var lesson = await Lesson.findOne({ course_id: courseId });
      if (lesson == null)
        return res.json({ error: "Khoá học này chưa khả dụng" });
      return res.redirect(`/learning/${req.params.id}?videos=${lesson._id}`);
    }

    try {
      let courseId = req.params.id;
      let course = await Course.findOne({ _id: courseId });

      var lessons = await Lesson.find({ course_id: courseId });
      var userLesson = await UserLesson.find({ user_id: userInfor.id });



      const filterLesson = userLesson.filter(user => {
        return lessons.some(lesson => user.lesson_id == lesson._id)
      });

      //tim tat ca cac lesson cua course
      const countLesson = lessons.filter(countLes => countLes.isFinish == true || countLes.isFinish == false);
      const sumCountLesson = countLesson.length
      
      const countCheckLesson = filterLesson.filter(userLes => userLes.isFinish == true || userLes.isFinish == false);
     
      //tim cac lesson da hoc
      const countFinish = filterLesson.filter(userLes => userLes.isFinish == true);
      const sumFinish = countFinish.length
      console.log(countCheckLesson);


      //tinh phan tram cua lesson da hoc
      var percentFinish;
      if (sumFinish == 0 && sumCountLesson == 0) {
        percentFinish = 0;
      }
      else {
        percentFinish = sumFinish / sumCountLesson * 100;
      }

      let currentLesson;
      lessons.forEach((lesson) => {
        if (lesson._id == videoId) {
          currentLesson = lesson;
        }
      });
      var userTracking = await UserLesson.findOne({
        user_id: userInfor.id,
        lesson_id: currentLesson._id,
      });

      res.render("userLearning/user-learning.ejs", {
        progress: userTracking == null ? 0 : userTracking.progress,
        lessons,
        currentLesson,
        course,
        userLesson,
        sumCountLesson,
        sumFinish,
        percentFinish,
        countFinish,
        countCheckLesson,
        // checkFinish,
        ...authMiddleware.userInfor(req),
      });
    } catch (e) {
      console.log(e);
      res.json(e);
    }
  }
  async trackUser(req, res, next) {
    try {
      var userInfor = authMiddleware.userInfor(req);
      if (userInfor.id == null) return res.json("Ban phai dang nhap truoc");
      // console.log(typeof req.params.lessonid);
      // console.log(req.body);
      var doc = await UserLesson.findOne({
        user_id: userInfor.id,
        lesson_id: req.params.lessonid,
      });
      if (doc == null)
        doc = new UserLesson({
          user_id: userInfor.id,
          lesson_id: req.params.lessonid,
        });
      doc.progress = req.body.progress;
      if (req.body.highestPercent > 90) doc.isFinish = true;
      var res = await doc.save();
      // console.log(doc);
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
    const userInfor = authMiddleware.userInfor(req);
    try {
      var courses = await Course.find({ user_id: userInfor.id });
      res.render("seller/home.ejs", {
        ...authMiddleware.userInfor(req),
        courses,
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
  async addCourses1(req, res, next) {
    try {
      const category = await Category.find({});
      var courses = await Course.find({});
      res.render("seller/create1", {
        ...authMiddleware.userInfor(req),
        categories: category,
      });
    } catch (e) {
      console.log(e);
      res.json(e);
    }
  }

  // add Course demo
  async addCourses2(req, res, next) {
    try {
      var course = await Course.find({ _id: req.params.id });
      // console.log(course);
      var lessons = await Lesson.find({ course_id: req.params.id });
      // console.log(lessons);
      res.render("seller/create2", {
        ...authMiddleware.userInfor(req),
        lessons: lessons,
        course: course,
        // courses: mutipleMongooseToObject(courses),
      });
    } catch (e) {
      console.log(e);
      res.json(e);
    }
  }

  // bill Course demo
  async billCourses(req, res, next) {
    try {
      let userInfor = authMiddleware.userInfor(req);
      let courseId = req.params.id;
      let invoices = await Invoice.find({ course_id: courseId })
        .populate("user_id")
        .exec()
        .then((invoices) => {
          return invoices;
        });

      let course = await Course.findOne({ _id: courseId });

      invoices = await Promise.all(invoices.map(async (invoice) => {
        //lay cac ma video(lesson)
        var lessons = await Lesson.find({ course_id: courseId });
        var userLesson = await UserLesson.find({ user_id: invoice.user_id });

        //Loc 2 mang co lessonId giong nhau
        const filterLesson = userLesson.filter(user => {
          return lessons.some(lesson => user.lesson_id == lesson._id)
        });

        //tim tat ca cac lesson cua course
        const countLesson = lessons.filter(countLes => countLes.isFinish == true || countLes.isFinish == false);
        const sumCountLesson = countLesson.length

        //tim cac lesson da hoc
        const countFinish = filterLesson.filter(userLes => userLes.isFinish == true);
        const sumFinish = countFinish.length

        //tinh phan tram cua lesson da hoc
        var percentFinish;
        if (sumFinish == 0 && sumCountLesson == 0) {
          percentFinish = 0;
        }
        else {
          percentFinish = sumFinish / sumCountLesson * 100;
        }
        invoice = JSON.parse(JSON.stringify(invoice));
        var newInvoice = {
          ...invoice, percentFinish
        }
        // console.log(newInvoice);
        return newInvoice;
      }));

      res.render("seller/bill", {
        ...authMiddleware.userInfor(req),
        invoices: (invoices),
        course,
      });
    } catch (e) {
      console.log(e);
      res.json(e);
    }
  }

  // edit Course demo
  async editCourses(req, res, next) {
    let CourseId = req.params.id;
    try {
      const category = await Category.find({});
      var course = await Course.find({ _id: CourseId });
      const lessons = await Lesson.find({ course_id: course[0]._id });
      res.render("seller/edit", {
        ...authMiddleware.userInfor(req),
        categories: category,
        course: course[0],
        lessons: lessons,
      });
    } catch (err) {
      console.log(err);
    }
  }
  async updateCoursesOfSeller(req, res, next) {
    const formData = req.body;
    const userInfor = authMiddleware.userInfor(req);
    try {
      if (userInfor.id == null) throw "Bạn phải đăng nhập trước!";
      await Course.updateOne({ _id: req.params.id }, formData);
      res.redirect("/seller/");
    } catch (err) {
      console.log(err);
    }
  }

  // create courses of seller
  // [POST] seller/course/create1
  async sellerCreate1(req, res, next) {
    const formData = req.body;
    const userInfor = authMiddleware.userInfor(req);
    try {
      if (userInfor.id == null) throw "Bạn phải đăng nhập trước!";
      var newCourses = new Course({
        categories_id: formData.categories_id,
        user_id: userInfor.id,
        name: formData.name,
        image: formData.imageId,
        shortDescription: formData.shortDescription,
        description: formData.Description,
        price: formData.price,
        isValidated: false,
      });
      // res.json(newCourses);
      await newCourses.save((err, data) => {
        console.log({ err });
      });
      const id = await newCourses._id;
      Course.find({}, (err, data) => {
        if (!err) {
          res.redirect(`/seller/courses/create/2/${id}`);
        }
      });
    } catch (e) {
      console.log(e);
      res.json(e);
    }
  }

  // [POST] seller/course/create2
  async sellerCreate2(req, res, next) {
    const formData = req.body;
    try {
      var newLessons = new Lesson({
        course_id: req.params.id,
        urlVideo: formData.urlVideo,
        title: formData.title,
        // order:
        isFinish: false,
      });
      // res.json(newLessons);
      await newLessons.save((err, data) => {
        console.log({ err });
      });
      Lesson.find({}, (err, data) => {
        if (!err && formData?.isEdit) {
          res.redirect(`/seller/courses/${req.params.id}/edit`);
        }
        if (!formData?.isEdit) {
          res.redirect(`/seller/courses/create/2/${req.params.id}`);
        }
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
  async cart(req, res, next) {
    const userInfor = authMiddleware.userInfor(req);
    // console.log(userInfor)
    try {
      var coursesInCart =
        userInfor.username == null
          ? []
          : await UserCart.find({ user_id: userInfor.id })
            .populate("course_id")
            .exec()
            .then((userCart) => {
              let courses = userCart.map((course) => course.course_id);
              return courses;
            })
            .catch((e) => console.log(e));
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
  async checkout(req, res, next) {
    const userInfor = authMiddleware.userInfor(req);
    try {
      var sumPrice =
        userInfor.username == null
          ? null
          : await UserCart.find({ user_id: userInfor.id })
            .populate("course_id")
            .exec()
            .then((userCart) => {
              let sum = 0;
              userCart.forEach(
                (item) => (sum += parseFloat(item.course_id.price))
              );
              return sum;
            })
            .catch((e) => console.log(e));
      if (sumPrice != null)
        return res.render("checkout", {
          sumPrice,
          email: userInfor.username,
          title: "Check Out",
          ...authMiddleware.userInfor(req),
        });

      res.json({
        error: "You have to login first",
      });
    } catch (e) {
      res.json(e);
      console.log(e);
    }
  }

  // Payment checkout to striped
  // [Post] /cart/payment
  async payment(req, res, next) {
    const userInfor = authMiddleware.userInfor(req);
    const { email, number, exp_month, exp_year, cvc } = req.body;
    var sumPrice =
      userInfor.username == null
        ? null
        : await UserCart.find({ user_id: userInfor.id })
          .populate("course_id")
          .exec()
          .then((userCart) => {
            let sum = 0;
            userCart.forEach(
              (item) => (sum += parseFloat(item.course_id.price))
            );
            return sum;
          })
          .catch((e) => console.log(e));
    try {
      // Create token check valid card
      const token = await stripe.tokens.create({
        card: {
          number,
          exp_month,
          exp_year,
          cvc,
        },
      });
      // Create customer to save email customer to show in bill
      const customer = await stripe.customers.create({
        email,
        source: token.id,
      });
      // Create charge method to payment
      const charge = await stripe.charges.create({
        amount: parseFloat(sumPrice) * 100,
        currency: 'usd',
        customer: customer.id,
        // Verify your integration in this guide by including this parameter
        metadata: { integration_check: "accept_a_payment" },
        receipt_email: email,
      });
      // Save transaction data value and status
      var transactions = new Transaction({
        user_id: userInfor.id,
        email,
        chargeID: charge.id,
        cartNumber: number,
        price: sumPrice,
        status: true
      })
      // Add course in Mylearning and invoices
      const courseInCart = await UserCart.find({ user_id: userInfor.id })
        .populate("course_id")
        .exec()
      console.log(courseInCart);
      courseInCart.forEach(async (course) => {
        var usercourses = new UserCourse({
          user_id: userInfor.id,
          course_id: course.course_id._id
        })
        var invoices = new Invoice({
          user_id: userInfor.id,
          course_id: course.course_id._id,
          totalPayout: course.course_id.price
        })
        await usercourses.save();
        await invoices.save();
      })
      await transactions.save();
      // Delete course out of userCart
      await UserCart.deleteMany({ user_id: userInfor.id })
        .then(function () {
          console.log("Data deleted"); // Success
        }).catch(function (error) {
          console.log(error); // Failure
        });
      res.redirect("/result");
    } catch (err) {
      resultPayment = err.raw.message;
      res.redirect("/error");
    }
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
          status: "failed",
        });
      else
        res.json({
          status: "success",
        });
    } catch (e) {
      console(e);
      res.json(e);
    }
  }
  //PUT /cart
  async addCoursesToUserCart(req, res, next) {
    const userInfor = authMiddleware.userInfor(req);
    if (!userInfor.username) return res.sendStatus(401);

    const itemData = new UserCart({
      user_id: userInfor.id,
      course_id: req.body.course_id,
    });
    try {
      await itemData.save();
      res.json({
        status: "success",
      });
    } catch (e) {
      res.json(e);
      console.log(e);
    }
    // res.json(req.body.course_id)
  }
  //DELETE /cart
  async deleteCourseToUserCart(req, res, next) {
    const userInfor = authMiddleware.userInfor(req);
    if (!userInfor.username) return res.sendStatus(401);
    // console.log({ user_id: userInfor.id, course_id: req.body.course_id });
    try {
      const result = await UserCart.deleteOne({
        user_id: userInfor.id,
        course_id: req.body.course_id,
      });
      console.log(result);
      res.json({
        status: "success",
      });
    } catch (e) {
      console.log(e);
      res.json(e);
    }
  }

  // [GET] /seller/course/create/2/:id/edit
  async editVideo(req, res, next) {
    try {
      var lessons = await Lesson.find({ _id: req.params.id });
      res.render("seller/edit2.ejs", {
        ...authMiddleware.userInfor(req),
        lessons: lessons,
      });
    } catch (e) {
      console.log(e);
      res.json(e);
    }
  }
  // checkout(req, res, next) {
  //   res.render("checkout", {
  //     title: "Check Out",
  //     ...authMiddleware.userInfor(req),
  //   });
  // }
  // [PUT] /seller/course/create/2/:id
  async updateVideo(req, res, next) {
    try {
      const lessons = await Lesson.find({ _id: req.params.id });
      const { title, urlVideo } = req.body;
      await Lesson.findOneAndUpdate(
        { _id: Number(req.params.id) },
        { urlVideo, title, isFinish: false }
      );
      lessons.map((les) => {
        const id = les.course_id;
        res.redirect(`http://localhost:8080/seller/courses/create/2/${id}`);
      });
    } catch (e) {
      console.log(e.message);
      // res.json(e);
    }
  }

  // [DELETE] /seller/course/create/2/:id
  async destroy(req, res, next) {
    try {
      const lessons = await Lesson.find({ _id: req.params.id });
      await Lesson.findByIdAndDelete({ _id: req.params.id });
      lessons.map((les) => {
        const id = les.course_id;
        res.redirect(`http://localhost:8080/seller/courses/create/2/${id}`);
      });
    } catch (e) {
      console.log(e);
      res.json(e);
    }
  }

  payment_success(req, res, next) {
    res.render("payment_success", {
      title: "Payment Success",
      ...authMiddleware.userInfor(req),
    });
  }

  payment_error(req, res, next) {
    res.render("payment_error", {
      title: "Payment Error",
      error: resultPayment,
      ...authMiddleware.userInfor(req),
    });
  }
}

module.exports = new SiteController();
