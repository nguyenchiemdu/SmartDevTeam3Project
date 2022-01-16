const Course = require("../models/Course");
const User = require("../models/User");
const Category = require("../models/Category");
const UserCart = require("../models/UserCart");
const UserCourse = require("../models/UserCourse");
const Lesson = require("../models/Lesson");
const Comment = require("../models/Comment");
const Invoice = require("../models/Invoice");
const Role = require("../models/Role");
const Transaction = require("../models/Transaction");
const UserLesson = require("../models/UserLesson");

const listTable = {
  users: User,
  courses: Course,
  categories: Category,
  usercarts : UserCart,
  usercourses : UserCourse,
  lessons : Lesson,
  comments : Comment,
  invoices : Invoice,
  roles : Role,
  transactions : Transaction,
  userlessons : UserLesson
};
var authMiddleware = require("../middlerwares/auth.middleware")
const {
  mongooseToObject,
  mutipleMongooseToObject,
} = require("../utilities/mongoose");

class TableController {
  async showTable(req, res, next) {
    try {
      var targetTable = listTable[req.params.table];
      var tableData = await targetTable.find({});
      tableData = tableData.map(item => JSON.parse(JSON.stringify(item)));
      res.render("admin/table-show", { tableData: tableData, tableName : req.params.table, ...authMiddleware.userInfor(req) });
    } catch (e) {
      console.log(e);
      res.json(e);
    }
  }
  // [GET] /course/create
  async create(req, res, next) {
    try {
      var targetTable = listTable[req.params.table];
      var itemData = await targetTable.findOne({});
      itemData =  JSON.parse(JSON.stringify(itemData));
      for (var key in itemData) itemData[key] = ''
      // delete itemData._id;
      res.render("admin/item-create", {
        itemData: (itemData),
        tableName : req.params.table,
        notification : ''
      });
    } catch (e) {
      console.log(e);
      res.json(e);
    }
  }

  // [POST] /course/store
  async store(req, res, next) {
    const formData = req.body;
    // formData.image = `http://img.youtube.com/vi/${req.body.videoId}/sddefault.jpg`;
    var targetTable = listTable[req.params.table];
    const itemData = new targetTable(req.body);

    try {
      await itemData.save();
      res.redirect("/admin/");
    } catch (e) {
      console.log(e);
      res.json(e);
    }
  }

  // [GET] /course/:id/edit
  async edit(req, res, next) {
    try {
      // var course = await Course.findById(req.params.id);
      var targetTable = listTable[req.params.table];
      var itemData = await targetTable.findById(req.params.id);
      itemData =  JSON.parse(JSON.stringify(itemData));
      res.render("admin/item-edit", {
        itemData: (itemData),
        tableName : req.params.table,
        notification : ''
      });
    } catch (e) {
      console.log(e);
      res.json(e);
    }
  }

  // [PUT] /course/:id
  async update(req, res, next) {
    try {
      var targetTable = listTable[req.params.table];
      await targetTable.updateOne({ _id: req.params.id }, req.body);
      res.redirect("/admin/"+req.params.table+'/');
    } catch (e) {
      console.log(e);
      res.json(e);
    }
  }

  // [DELETE] /course/:id
  async destroy(req, res, next) {
    try {
      console.log(req)
      var targetTable = listTable[req.params.table];
      await targetTable.deleteOne({ _id: req.params.id });
      res.redirect('/admin/'+req.params.table+'/');
    } catch (e) {
      console.log(e);
      res.json(e);
    }
  }

  async kiemduyet(req, res, next) {
    const courseIsNotValidate = await Course.find({isValidated: 0})
    console.log(courseIsNotValidate);
    try {
      res.render("admin/kiemduyet",{ ...authMiddleware.userInfor(req), courseIsNotValidate});
    } catch (e) {
      console.log(e);
      res.json(e);
    }
  }
}

module.exports = new TableController();
