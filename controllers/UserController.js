var authMiddleware = require("../middlerwares/auth.middleware");
const User = require("../models/User.js")
var userID;
class UserController{
    async show(req, res, next){
        const userInfor = authMiddleware.userInfor(req);
        try{
            if(userInfor.id === null) throw { message: "Bạn phải đăng nhập trước", status: 401 };
            const user = await User.findOne({ _id: userInfor.id });
            res.render("userProfile/view-user-profile",{
                ...userInfor,
                userInfor: userInfor,
                user: user
            })
        }catch(err){
            next(err);
        }
    }
    async editProfile(req, res, next){
        const userInfor = authMiddleware.userInfor(req);
        const user = await User.findOne({ _id: userInfor.id });
        res.render("user-profile",{
            ...userInfor,
            userInfor: userInfor,
            user: user
        })
    }
    async confirmEdit(req, res, next){
        const userInfor = authMiddleware.userInfor(req);
        const {firstName, lastName , email} = req.body;
        try{
            await User.updateOne({ _id: userInfor.id }, { firstName, lastName, email});
            res.redirect('/user');
        }catch(err){
            next(err);
        }
    }
}
module.exports = new UserController();