require('dotenv').config()
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Course = require("../models/Course");
class SellerMiddleware {
    async authenSeller(req,res,next){
        console.log(req.params.id);
        //Check token
        let payload
        try {
            payload = jwt.verify(req.cookies.accessToken, process.env.JWT_SECRET);
            // var currentUser = await User.findOne({_id : payload.id}).populate('role_id');
             try {var course = await Course.findOne({_id : req.params.id});}
             catch (e) {
                return res.render('error',{error :{status : 404}, message : 'Not found'});
             }
            if (course == null) throw {message : 'Not found', status : 404};
            if (course.user_id != payload.id) throw {message : 'You have no permision to access thid path', status : 403};
            next();
        }
        catch (e) {
            res.render('error',{error :e, message : e.message});
        }
    }
}

module.exports = new SellerMiddleware();
