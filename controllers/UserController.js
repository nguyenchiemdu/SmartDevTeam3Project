const User = require('../models/User')
const { mongooseToObject } = require('../utilities/mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const JWT_SECRET = 'hfoiuvanrbfipsnmjoguhgiua87256345yY&^&%&87fhnonsofghnjfidhngjsfdhn'



class UserController {
    // [POST] /users/api/password
    async password(req, res) {
        const { token, newpassword: plainTextPassword } = req.body

        if (!plainTextPassword || typeof plainTextPassword !== 'string') {
            return res.json({ status: 'error', error: 'Invalid password' })
        }

        if (plainTextPassword.length < 5) {
            return res.json({ status: 'error', error: 'Password to small. Should be atleast 6 characters' })
        }
        try {
            const user = jwt.verify(token, JWT_SECRET)

            const _id = user.id
            const password = await bcrypt.hash(plainTextPassword, 10)
            await User.updateOne(
                { _id },
                {
                    $set: { password }
                }
            )
            res.json({ status: 'ok' })
        } catch (error) {
            console.log(error)
            res.json({ status: 'error', error: ';))' })
        }

        console.log('JWT decoded: ', user);

    }

    async login(req, res) {
        const { username, password } = req.body
        const user = await User.findOne({ username }).lean()

        if (!user) {
            return res.json({ status: 'error', error: 'Invalid username/password' })
        }

        if (await bcrypt.compare(password, user.password)) {

            const token = jwt.sign({
                id: user._id,
                username: user.username
            }, JWT_SECRET
            )

            return res.json({ status: 'ok', data: token })
        }

        res.json({ status: 'error', data: 'Invalid username/password' })
    }
    async register(req, res) {
        // console.log(req.body);
        const { username, password: plainTextPassword } = req.body

        if (!username || typeof username !== 'string') {
            return res.json({ status: 'error', error: 'Invalid username' })
        }

        if (!plainTextPassword || typeof plainTextPassword !== 'string') {
            return res.json({ status: 'error', error: 'Invalid password' })
        }

        if (plainTextPassword.length < 5) {
            return res.json({ status: 'error', error: 'Password to small. Should be atleast 6 characters' })
        }

        const password = await bcrypt.hash(plainTextPassword, 10)

        try {
            const response = await User.create({
                username,
                password
            })
            console.log('User created successfully: ', response);
        } catch (error) {
            console.log(JSON.stringify(error));
            if (error.code === 11000) {
                return res.json({ status: 'error', error: 'Username already in use' })
            }
            throw error
        }

        res.json({ status: 'ok' })
    }


}

module.exports = new UserController;