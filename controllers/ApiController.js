const Note = require('../models/Note');
var authMiddleware = require("../middlerwares/auth.middleware");

class ApiController {
    // Note APi
    // [GET]
    async getNote(req, res, next) {
        const k = await Note.find();
        console.log(Note);
        res.json(k);
    }
    // [Post]
    async postNote(req, res, next) {
        const {lesson_id,comment, course_id,second} = req.body;
        let userInfor = authMiddleware.userInfor(req);
        try{
            const note = new Note({
                user_id : userInfor.id,
                lesson_id : parseInt(lesson_id),
                comment,
                second
            });
            await note.save();
            res.redirect("back");
        }
        catch(err){
            next(err);
        }
    }
}

module.exports = new ApiController();