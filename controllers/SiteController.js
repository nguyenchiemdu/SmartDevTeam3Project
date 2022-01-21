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
const paypal = require("paypal-rest-sdk");
// const paypal = Paypal(process.env.PAYPAL_SECRET_KEY);
const UserCourse = require("../models/UserCourse");
const UserLesson = require("../models/UserLesson");
const Transaction = require("../models/Transaction");
const Comment = require("../models/Comment");
var url = require("url");
const { monkeyLearnAnalysis } = require("../utilities/monkeyLearn");
var findCourseBySlug, resultPayment, totalSumCart, userNow;
const { copy } = require("../app");
const { userInfor } = require("../middlerwares/auth.middleware");
const axios = require("axios").default;
var ytDurationFormat = require("youtube-duration-format");
paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "Af28FeslwhxWrQgkN15xEqGK6kUviwhpg1uc7SvOpQSHL1SWywAqBdpSDpQlPFSlkeyb6M2aolPeJjo-",
  client_secret:
    "EP3Xp3p9mUMiyDeXRsv-lL4eKEzpG5lnHBJZwHWeyHOZur-FBycdsG387jVOGNGEK7ZquOWvr4AhHgtB",
});

const pagination = async (
  req,
  Table,
  pageSize,
  populateString,
  findCondition
) => {
  try {
    let page = req.query.page || 1;
    return await Table.find(findCondition)
      .skip(pageSize * page - pageSize)
      .limit(pageSize)
      .populate(populateString)
      .exec()
      .then(async (docs) => {
        var countResult;
        let pages = await Table.countDocuments(findCondition).then((count) => {
          // đếm để tính xem có bao nhiêu trang
          countResult = count;
          let pages = Math.ceil(count / pageSize);
          return pages;
        });
        return { docs, page, pages, countResult };
      });
  } catch (e) {
    console.log(e);
    next(e);
  }
};
const getYoutubeVideoDuration = async (videoId) => {
  var result = await axios
    .get(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=AIzaSyDR5YdTOMZJ43q47od7XVSGLfjQCRNwegA`
    )
    .then((response) => {
      // handle success
      var youtubeTime = response.data.items[0].contentDetails.duration;
      // console.log(youtubeTime);
      var duration = ytDurationFormat(youtubeTime);
      // console.log(duration);
      return duration;
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
  return result;
};

class SiteController {
  // GET /
  async home(req, res, next) {
    //////////
    try {
      var data = await Promise.all([
        Course.find({ isValidated: 1 }),
        Category.find({}),
      ]);
      res.render("index.ejs", {
        ...authMiddleware.userInfor(req),
        courses: mutipleMongooseToObject(data[0]),
        categories: mutipleMongooseToObject(data[1]),
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
  // [GET] /courses
  async courses(req, res, next) {
    try {
      const pageSize = 8;
      let result = await pagination(req, Course, pageSize, "", {
        isValidated: 1,
      }).then((res) => res);
      // const validatedCourse = result.docs.filter((item) => item.isValidated === 1);
      res.render("courses-view.ejs", {
        ...authMiddleware.userInfor(req),
        courses: result.docs, // sản phẩm trên một paga
        current: result.page, // page hiện tại
        pages: result.pages, // tổng số các page
      });
    } catch (e) {
      console.log(e);
      next(e);
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
      let pageSize = 4;
      let userInfor = authMiddleware.userInfor(req);
      if (userInfor.username == null)
        throw { message: "Bạn phải đăng nhập trước", status: 401 };
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
      userCourses = await Promise.all(
        userCourses.map(async (course) => {
          var lessons = await Lesson.find({ course_id: course._id });
          var userLesson = await UserLesson.find({ user_id: userInfor.id });

          //Loc 2 mang co lessonId giong nhau
          const filterLesson = userLesson.filter((user) => {
            return lessons.some((lesson) => user.lesson_id == lesson._id);
          });

          //tim tat ca cac lesson cua course
          const countLesson = lessons.filter(
            (countLes) =>
              countLes.isFinish == true || countLes.isFinish == false
          );
          const sumCountLesson = countLesson.length;

          //tim cac lesson da hoc
          const countFinish = filterLesson.filter(
            (userLes) => userLes.isFinish == true
          );
          const sumFinish = countFinish.length;

          //tinh phan tram cua lesson da hoc
          var percentFinish;
          if (sumFinish == 0 && sumCountLesson == 0) {
            percentFinish = 0;
          } else {
            percentFinish = (sumFinish / sumCountLesson) * 100;
          }
          course = JSON.parse(JSON.stringify(course));
          var newCourse = {
            ...course,
            percentFinish,
          };

          return newCourse;
        })
      );

      //Code cua Tu
      // let result = await pagination(req,UserCourse,pageSize,'course_id').then(res => res)
      //   console.log(result.docs);
      //   let userCourses = result.docs.map(doc => doc.course_id);
      // res.render("learning.ejs", {
      //   ...authMiddleware.userInfor(req),
      //   courses : userCourses, // sản phẩm trên một paga
      //   current: result.page, // page hiện tại
      //   pages: result.pages

      // console.log(userCourses);
      res.render("learning.ejs", {
        ...authMiddleware.userInfor(req),
        courses: userCourses,
      });
    } catch (e) {
      next(e);
      // console.log(e);
      // res.json(e);
    }
  }
  async userLearning(req, res, next) {
    try {
      let userInfor = authMiddleware.userInfor(req);
      if (userInfor.id == null)
        throw { message: "Bạn phải đăng nhập trước", status: 401 };
      let courseId = req.params.id;
      let course = await Course.findOne({ _id: courseId });

      let videoId = req.query.videos;
      if (videoId == null) {
        var lesson = await Lesson.findOne({ course_id: courseId });
        if (lesson == null)
          throw { message: "Khoá học này chưa khả dụng", status: 403 };
        return res.redirect(`/learning/${req.params.id}?videos=${lesson._id}`);
      }
      var lessons = await Lesson.find({ course_id: courseId });
      lessons = await Promise.all(
        lessons.map(async (lesson) => {
          let duration = await getYoutubeVideoDuration(lesson.urlVideo);
          // console.log(duration);
          var newLesson = { ...JSON.parse(JSON.stringify(lesson)), duration };
          return newLesson;
        })
      );
      var userLesson = await UserLesson.find({ user_id: userInfor.id });
      const filterLesson = userLesson.filter((user) => {
        return lessons.some((lesson) => user.lesson_id == lesson._id);
      });

      //tim tat ca cac lesson cua course
      // const countLesson = lessons.filter(
      //   (countLes) => countLes.isFinish == true || countLes.isFinish == false
      // );
      const sumCountLesson = lessons.length;

      const countCheckLesson = filterLesson.filter(
        (userLes) => userLes.isFinish == true || userLes.isFinish == false
      );

      //tim cac lesson da hoc
      const countFinish = filterLesson.filter(
        (userLes) => userLes.isFinish == true
      );
      const sumFinish = countFinish.length;
      // console.log("countCheckLesson");
      // console.log(countCheckLesson);
      let mapIsFisnish = {};
      countCheckLesson.forEach((userlesson) => {
        mapIsFisnish[userlesson.lesson_id] = userlesson.isFinish;
      });

      //tinh phan tram cua lesson da hoc
      var percentFinish;
      if (sumFinish == 0 && sumCountLesson == 0) {
        percentFinish = 0;
      } else {
        percentFinish = (sumFinish / sumCountLesson) * 100;
      }
      
      // console.log(countCheckLesson);

      // kiem tra da xem hêt bai hoc hay chua?
      const findAllCourseNotFinished = countFinish.filter(
        (userLes) => userLes.isFinish
      );
      let hasAllFinished;
      if (findAllCourseNotFinished.length === sumCountLesson) {
        hasAllFinished = true;
      }
      else {
        hasAllFinished = false;
      };
      
      let currentLesson;
      let current = 0;
      for (let i=0;i< lessons.length;i++) {
        if (lessons[i]._id == videoId) {
          current = i;
        }
      };
      currentLesson = lessons[current];
      console.log(current);
      console.log(lessons[current-1]);
      if ( current >0 && mapIsFisnish[lessons[current-1]._id] != true ) throw { message: "Bạn chưa được phép học bài này", status: 403 };
      // console.log(beforeCurrentLesson);
      var userTracking = await UserLesson.findOne({
        user_id: userInfor.id,
        lesson_id: currentLesson._id,
      });
      if (userTracking == null) userTracking = {};
      let commentUser = await Comment.find({ course_id: courseId })
        .populate("user_id")
        .exec()
        .then((commentUser) => {
          return commentUser;
        });
      res.render("userLearning/user-learning.ejs", {
        progress: userTracking.progress == null ? 0 : userTracking.progress,
        lessons,
        currentLesson,
        course,
        userLesson,
        sumCountLesson,
        sumFinish,
        percentFinish,
        countFinish,
        countCheckLesson,
        mapIsFisnish,
        // checkFinish,
        commentUser,
        userTracking,
        hasAllFinished,
        ...authMiddleware.userInfor(req),
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
  //Post Comment
  async postComment(req, res, next) {
    const formData = req.body;
    const userInfor = authMiddleware.userInfor(req);
    let courseId = req.params.id;
    let videoId = req.query.videos;
    try {
      if (userInfor.id == null) throw "Bạn phải đăng nhập trước!";
      // Sentiment analysis comment
      const resultAnalysis = await monkeyLearnAnalysis(formData.comment);
      var newComment = new Comment({
        user_id: userInfor.id,
        course_id: courseId,
        commentContent: formData.comment,
        analyzeComment: resultAnalysis,
      });
      await newComment.save();
      res.redirect(`/learning/${courseId}?video=${videoId}`);
    } catch (e) {
      console.log(e);
      res.json(e);
    }
  }

  async trackUser(req, res, next) {
    let courseId = req.params.id;
    let videoId = req.query.videos;
    try {
      var userInfor = authMiddleware.userInfor(req);
      if (userInfor.id == null)
        throw { message: "Bạn phải đăng nhập trước", status: 401 };
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
      await doc.save();
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
  // async certification(req, res, next) {
  //   try {
  //     res.render("certification-information.ejs");
  //   } catch (e) {
  //     console.log(e);
  //     next(e);
  //   }
  // }
  async search(req, res, next) {
    const pageSize = 4;
    try {
      const searchName = req.query.name;
      let result = await pagination(req, Course, pageSize, "", {
        name: { $regex: searchName, $options: "i" },
      });

      res.render("searchPage.ejs", {
        personSearch: mutipleMongooseToObject(result.docs),
        current: result.page, // page hiện tại
        pages: result.pages,
        searchName: searchName,
        countSearch: result.countResult,
        ...authMiddleware.userInfor(req),
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async home_seller(req, res, next) {
    try {
      const userInfor = authMiddleware.userInfor(req);
      let userCoursesName = [],
        userCoursePrices = [];
      let courses = await Course.find({ user_id: userInfor.id });
      if (userInfor.username == null) {
        throw { message: "Bạn phải đăng nhập trước", status: 401 };
      } else {
        var validatedCourse = await Course.find({
          user_id: userInfor.id,
          isValidated: 1,
        });
        for (let index = 0; index < validatedCourse.length; index++) {
          userCoursesName.push(validatedCourse[index].name);
          const courseIsPaid = await Invoice.find({
            course_id: validatedCourse[index]._id,
          }).populate("course_id");
          if (courseIsPaid.length > 0) {
            let sum = 0;
            courseIsPaid.forEach((course) => {
              sum += course.totalPayout;
            });
            userCoursePrices.push(sum);
          } else {
            userCoursePrices.push(0);
          }
        }
      }
      res.render("seller/home.ejs", {
        ...authMiddleware.userInfor(req),
        courses: courses,
        userCoursesName,
        userCoursePrices,
      });
    } catch (e) {
      console.log(e);
      next(e);
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
      next(e);
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
      next(e);
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
      next(e);
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

      invoices = await Promise.all(
        invoices.map(async (invoice) => {
          //lay cac ma video(lesson)
          var lessons = await Lesson.find({ course_id: courseId });
          var userLesson = await UserLesson.find({ user_id: invoice.user_id });

          //Loc 2 mang co lessonId giong nhau
          const filterLesson = userLesson.filter((user) => {
            return lessons.some((lesson) => user.lesson_id == lesson._id);
          });

          //tim tat ca cac lesson cua course
          const countLesson = lessons.filter(
            (countLes) =>
              countLes.isFinish == true || countLes.isFinish == false
          );
          const sumCountLesson = countLesson.length;

          //tim cac lesson da hoc
          const countFinish = filterLesson.filter(
            (userLes) => userLes.isFinish == true
          );
          const sumFinish = countFinish.length;

          //tinh phan tram cua lesson da hoc
          var percentFinish;
          if (sumFinish == 0 && sumCountLesson == 0) {
            percentFinish = 0;
          } else {
            percentFinish = (sumFinish / sumCountLesson) * 100;
          }
          invoice = JSON.parse(JSON.stringify(invoice));
          var newInvoice = {
            ...invoice,
            percentFinish,
          };
          // console.log(newInvoice);
          return newInvoice;
        })
      );

      res.render("seller/bill", {
        ...authMiddleware.userInfor(req),
        invoices: invoices,
        course,
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  // edit Course demo
  async editCourses(req, res, next) {
    let CourseId = req.params.id;
    try {
      let category = await Category.find({});
      category = category.map((item) => {
        return {
          nameCategory: item.nameCategory,
          _id: item._id.toString(),
        };
      });
      console.log(typeof category[0]._id);
      var course = await Course.find({ _id: CourseId });
      const lessons = await Lesson.find({ course_id: course[0]._id });
      course = {
        _id: course[0]._id,
        user_id: course[0].user_id,
        name: course[0].name,
        image: course[0].image,
        shortDescription: course[0].shortDescription,
        description: course[0].description,
        price: course[0].price,
        categories_id: course[0].categories_id.toString(),
      };

      res.render("seller/edit", {
        ...authMiddleware.userInfor(req),
        categories: category,
        course: course,
        lessons: lessons,
      });
    } catch (err) {
      console.log(err);
      next(e);
    }
  }
  async updateCoursesOfSeller(req, res, next) {
    const formData = req.body;
    const userInfor = authMiddleware.userInfor(req);
    try {
      if (userInfor.id == null)
        throw { message: "Bạn phải đăng nhập trước", status: 401 };
      await Course.updateOne({ _id: req.params.id }, formData);
      res.redirect("/seller/");
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  // create courses of seller
  // [POST] seller/course/create1
  async sellerCreate1(req, res, next) {
    const formData = req.body;
    const userInfor = authMiddleware.userInfor(req);
    try {
      if (userInfor.id == null)
        throw { message: "Bạn phải đăng nhập trước", status: 401 };
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
      await newCourses.save();
      const id = await newCourses._id;
      Course.find({}, (err, data) => {
        if (!err) {
          res.redirect(`/seller/courses/create/2/${id}`);
        }
      });
    } catch (e) {
      console.log(e);
      next(e);
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
      await newLessons.save();
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
      next(e);
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
      next(e);
    }
  }
  async checkout(req, res, next) {
    const userInfor = authMiddleware.userInfor(req);
    try {
      var infoCheckout =
        userInfor.username == null
          ? null
          : await UserCart.find({ user_id: userInfor.id })
              .populate("course_id")
              .exec()
              .then((userCart) => {
                let sum = 0;
                var courses = userCart.map((course) => course.course_id);
                userCart.forEach(
                  (item) => (sum += parseFloat(item.course_id.price))
                );
                return { sum, courses };
              })
              .catch((e) => console.log(e));
      if (infoCheckout != null)
        return res.render("checkout", {
          courses: infoCheckout.courses,
          sumPrice: infoCheckout.sum,
          email: userInfor.username,
          title: "Check Out",
          ...authMiddleware.userInfor(req),
        });

      throw { message: "Bạn phải đăng nhập trước", status: 401 };
    } catch (e) {
      next(e);
      console.log(e);
    }
  }

  // Payment checkout to striped
  // [Post] /cart/payment
  async payment(req, res, next) {
    var emailIsChecked;
    const userInfor = authMiddleware.userInfor(req);
    const { email, number, exp_month, exp_year, cvc } = req.body;
    if (email.includes("@")) {
      emailIsChecked = email;
    } else {
      emailIsChecked = email + "@gmail.com";
    }
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
        email: emailIsChecked,
        source: token.id,
      });
      // Create charge method to payment
      const charge = await stripe.charges.create({
        amount: parseFloat(sumPrice) * 100,
        currency: "usd",
        customer: customer.id,
        // Verify your integration in this guide by including this parameter
        metadata: { integration_check: "accept_a_payment" },
        receipt_email: emailIsChecked,
      });
      // Save transaction data value and status
      var transactions = new Transaction({
        user_id: userInfor.id,
        email: emailIsChecked,
        chargeID: charge.id,
        cartNumber: number,
        price: sumPrice,
        status: "approved",
      });
      // Add course in Mylearning and invoices
      const courseInCart = await UserCart.find({ user_id: userInfor.id })
        .populate("course_id")
        .exec();
      console.log(courseInCart);
      courseInCart.forEach(async (course) => {
        var usercourses = new UserCourse({
          user_id: userInfor.id,
          course_id: course.course_id._id,
        });
        var invoices = new Invoice({
          user_id: userInfor.id,
          course_id: course.course_id._id,
          totalPayout: course.course_id.price,
        });
        await usercourses.save();
        await invoices.save();
      });
      await transactions.save();
      // Delete course out of userCart
      await UserCart.deleteMany({ user_id: userInfor.id })
        .then(function () {
          console.log("Data deleted"); // Success
        })
        .catch(function (error) {
          console.log(error); // Failure
        });
      res.redirect("/result");
    } catch (err) {
      resultPayment = err.raw.message;
      res.redirect("/error");
    }
  }

  // [Post] /cart/paymentPaypal
  async paymentPaypal(req, res, next) {
    const userInfor = authMiddleware.userInfor(req);
    userNow = userInfor;
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
    const sum = sumPrice.toString() + ".00";
    totalSumCart = sumPrice.toString() + ".00";
    // Add course in Mylearning and invoices
    const courseInCart = await UserCart.find({ user_id: userInfor.id })
      .populate("course_id")
      .exec();
    var items = [];
    courseInCart.forEach((course) => {
      var item = {
        name: course.course_id.name,
        price: course.course_id.price.toString() + ".00",
        currency: "USD",
        quantity: "1",
      };
      items.push(item);
    });
    try {
      var create_payment_json = {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        transactions: [
          {
            amount: {
              currency: "USD",
              total: sum,
            },
            item_list: {
              items: items,
            },
            description: "This is the payment description.",
          },
        ],
        redirect_urls: {
          return_url: "http://localhost:8080/result/paypal",
          cancel_url: "http://localhost:8080/error",
        },
      };
      console.log(create_payment_json.transactions[0].item_list);
      paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
          throw error;
        } else {
          for (let i = 0; i < payment.links.length; i++) {
            if (payment.links[i].rel == "approval_url") {
              res.redirect(payment.links[i].href);
            }
          }
        }
      });
      // res.redirect("/result/paypal");
    } catch (err) {
      // resultPayment = err.raw.message;
      next(err);
      // res.redirect("/error");
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
      next(e);
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
      next(e);
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
      next(e);
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
      next(e);
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
      next(e);
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
        if (req.body.isEdit) {
          res.redirect(`/seller/courses/${id}/edit`);
        } else {
          res.redirect(`http://localhost:8080/seller/courses/create/2/${id}`);
        }
      });
    } catch (e) {
      console.log(e.message);
      next(e);
    }
  }

  // [DELETE] /seller/course/create/2/:id
  async destroy(req, res, next) {
    try {
      const lessons = await Lesson.find({ _id: req.params.id });
      await Lesson.findByIdAndDelete({ _id: req.params.id });
      if (req.query.edit) {
        lessons.map((les) => {
          const id = les.course_id;
          res.redirect(`/seller/courses/${id}/edit`);
        });
      } else {
        lessons.map((les) => {
          const id = les.course_id;
          res.redirect(`http://localhost:8080/seller/courses/create/2/${id}`);
        });
      }
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  payment_success(req, res, next) {
    res.render("payment_success", {
      title: "Payment Success",
      ...authMiddleware.userInfor(req),
    });
  }

  async payment_paypal_success(req, res, next) {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: totalSumCart,
          },
        },
      ],
    };
    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      async function (error, payment) {
        try {
          if (error) {
            console.log(error.response);
            throw error;
          } else {
            console.log(
              payment.id,
              payment.state,
              payment.payer.payer_info.email
            );
            console.log(userNow);
            // Save transaction data value and status
            var transactions = new Transaction({
              user_id: userInfor.id,
              email: payment.payer.payer_info.email,
              chargeID: payment.id,
              price: totalSumCart,
              status: payment.state,
            });
            // Add course in Mylearning and invoices
            const courseInCart = await UserCart.find({ user_id: userNow.id })
              .populate("course_id")
              .exec();
            console.log(courseInCart);
            courseInCart.forEach(async (course) => {
              var usercourses = new UserCourse({
                user_id: userNow.id,
                course_id: course.course_id._id,
              });
              var invoices = new Invoice({
                user_id: userNow.id,
                course_id: course.course_id._id,
                totalPayout: course.course_id.price,
              });
              await usercourses.save();
              await invoices.save();
            });
            await transactions.save();
            // Delete course out of userCart
            await UserCart.deleteMany({ user_id: userNow.id })
              .then(function () {
                console.log("Data deleted"); // Success
              })
              .catch(function (error) {
                console.log(error); // Failure
              });
            // console.log(JSON.stringify(payment));
            res.render("payment_success", {
              title: "Payment Success",
            });
          }
        } catch (error) {
          // resultPayment = err.raw.message;
          next(error);
          // res.redirect("/error");
        }
      }
    );
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
