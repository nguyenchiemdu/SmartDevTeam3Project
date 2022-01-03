require('dotenv').config()
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { use } = require('express/lib/router')
const { redirect } = require('express/lib/response')



class AuthController {
    // POST / xac thuc nguoi dung va tra ve jwt to client
    async login(req, res, next) {
        try {
            // Authentication 
            const user = await User.findOne({ email: req.body.email, password: req.body.password })
            if (!user) return res.sendStatus(401)
            //Create JWT
            const { email, password } = user
            const token = generateToken({ email })
            // Store refreshToken to DB
            // const updateResult = await User.updateOne({email: email},{email : email,password: password,  refreshToken :token.refreshToken })
            // console.log(updateResult)
            // return JWT in Cookie  Client
            // res.cookie("refreshToken", token.refreshToken, {
            //     httpOnly: true,
            //     sameSite: "strict",
            // })
            res.cookie("accessToken", token.accessToken, {
                httpOnly: true,
                sameSite: "strict",
            })
            // redirect to home page
            res.redirect('/')
        } catch (e) {
            console.log(e)
        }
    }
    async signout (req,res,next) {
        // Clear cookie 
        res.clearCookie('accessToken')
        res.redirect('/login')
    } 
    // cap JWT moi cho Client
    async token(req, res, next) {
        const refreshToken = req.body.refreshToken
        // neu trong request khong chua refreshToken thi tra ve loi 401
        if (!refreshToken) return res.sendStatus(401)
        // kiem tra xem token co nam trong database khong 
        const user = await User.find({ refreshToken: refreshToken })
        if (!user) return res.sendStatus(403)
        console.log(user)
        try {
            const decoded = jwt.verify(refreshToken, process.env.ACCESS_TOKEN_REFRESH)
            console.log(decoded)
            // Token hop le


        } catch (e) {
            // Token khong hop le
            console.log(e)
            return res.sendStatus(403)
        }

    }
}

generateToken = (payload) => {
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET,{expiresIn : '10d'})
    const refreshToken = jwt.sign(payload, process.env.ACCESS_TOKEN_REFRESH)
    return { accessToken, refreshToken }
}

module.exports = new AuthController;