require('dotenv').config()
const jwt = require("jsonwebtoken");
const User = require("../models/User");
class AdminMiddleware {
    async authenAdmin(req,res,next){
        //Check token
        let payload
        try {
            payload = jwt.verify(req.cookies.accessToken, process.env.JWT_SECRET);
            var currentUser = await User.findOne({_id : payload.id}).populate('role_id');
            if (currentUser.role_id.roleName == 'Admin') {
                if (req.originalUrl.split('/')[1] == 'admin') return next();
                 return res.redirect('/admin');
            } else {
                if (req.originalUrl.split('/')[1] == 'admin') return res.redirect('/');
                return next();
            }
        }
        catch (e) {
            next();
        }
    }
    userInfor(req){
        //Check token
        let payload
        try {
            payload = jwt.verify(req.cookies.accessToken, process.env.JWT_SECRET)
        }
        catch (e) {
            // console.log(e)
            payload = {
                username : null,
                id : null,
                iat : null
            };
        }
        return payload;
    }
}

module.exports = new AdminMiddleware();
