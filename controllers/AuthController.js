require('dotenv').config()
const User = require("../models/User");
const { mongooseToObject } = require("../utilities/mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserCart = require('../models/UserCart');
const { resolveInclude } = require('ejs');

class UserController {
  // [POST] /users/password
  async password(req, res) {
    const { token, newpassword: plainTextPassword } = req.body;
    console.log("token==", token);

    if (!plainTextPassword || typeof plainTextPassword !== "string") {
      return res.json({ status: "error", error: "Invalid password" });
    }

    if (plainTextPassword.length < 5) {
      return res.json({
        status: "error",
        error: "Password to small. Should be atleast 6 characters",
      });
    }
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);

      const _id = user.id;
      const password = await bcrypt.hash(plainTextPassword, 10);
      await User.updateOne(
        { _id },
        {
          $set: { password },
        }
      );
      res.json({ status: "ok" });
    } catch (error) {
      console.log(error);
      res.json({ status: "error", error: ":))" });
    }

    // console.log("JWT decoded: ", user);
  }

  async login(req, res) {
    try {
      // Authentication 
      const user = await User.findOne({ username: req.body.username })
      if (!user) return res.json({ status: 'failed' })
      if (! await bcrypt.compare(req.body.password, user.password)) return res.json({ status: 'failed' })

      //add local Cart to user Cart
      const cart = req.body.cart;
      cart.forEach(async course_id => {
        try {
          const result = await UserCart.findOne({ user_id: user._id, course_id: course_id });
          const isExisted = result ? true : false;
          if (!isExisted) {
            const itemData = new UserCart({ user_id: user._id, course_id: course_id });
            await itemData.save();
          }
        } catch (e) {
          console.log(e);
        }
      });

      //Create JWT
      const accessToken = jwt.sign(
        {
          id: user._id,
          username: user.username,
        },
        process.env.JWT_SECRET
      );
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "strict",
      })
      res.json({ status: 'success' })
      // redirect to home page
      // res.redirect('/')
    } catch (e) {
      console.log(e)
      res.json(e)
    }
  }
  async register(req, res) {
    // console.log(req.body);
    const { username, password: plainTextPassword } = req.body;

    if (!username || typeof username !== "string") {
      return res.json({ status: "error", error: "Invalid username" });
    }

    if (!plainTextPassword || typeof plainTextPassword !== "string") {
      return res.json({ status: "error", error: "Invalid password" });
    }

    if (plainTextPassword.length < 5) {
      return res.json({
        status: "error",
        error: "Password to small. Should be atleast 6 characters",
      });
    }

    const password = await bcrypt.hash(plainTextPassword, 10);

    try {
      const response = await User.create({
        username,
        password,
      });
      console.log("User created successfully: ", response);
    } catch (error) {
      console.log(JSON.stringify(error));
      if (error.code === 11000) {
        return res.json({ status: "error", error: "Username already in use" });
      }
      throw error;
    }

    res.json({ status: "ok" });
  }
  async signout(req, res, next) {
    // Clear cookie 
    res.clearCookie('accessToken')
    res.redirect('/login')
  }
}

module.exports = new UserController();
