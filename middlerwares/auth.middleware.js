require('dotenv').config()
const jwt = require("jsonwebtoken");

class AuthMiddleware {
    async authenticateUser(req,res,next){
        //Check token
        let payload
        try {
            payload = jwt.verify(req.cookies.accessToken, process.env.JWT_SECRET)
        }
        catch (e) {
            console.log(e)
            payload = null;
        }
        console.log(payload)
        req.params.username = payload == null ? null : payload.username
        req.params.uid = payload == null ? null : payload.id
        console.log(req.params)
        next()
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

module.exports = new AuthMiddleware();
