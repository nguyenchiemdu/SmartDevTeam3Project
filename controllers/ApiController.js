const Note = require('../models/Note');
var authMiddleware = require("../middlerwares/auth.middleware");
const UserLesson = require("../models/UserLesson");

class ApiController {
    // Note APi
    // [GET] Full List Note
    async getNote(req, res, next) {
        const k = await Note.find();
        console.log(Note);
        res.json(k);
    }

    // [GET] Note by lesson
    async getNoteByLesson(req, res, next) {
        let userInfor = authMiddleware.userInfor(req);
        const lessonId = req.params.lesson_id;
        const k = await Note.find({ user_id: userInfor.id, lesson_id: lessonId });
        res.json(k);
    }

    // [Post] Create new Note
    async postNote(req, res, next) {
        const { lesson_id, noteContent, course_id, second } = req.body;
        let userInfor = authMiddleware.userInfor(req);
        try {
            const note = new Note({
                user_id: userInfor.id,
                lesson_id: parseInt(lesson_id),
                noteContent,
                second
            });
            await note.save();
            res.redirect("back");
        }
        catch (err) {
            next(err);
        }
    }

    // [Patch] Edit note
    async editNote(req, res, next) {
        const kq = await Note.updateOne({ _id: req.params.id }, { noteContent: req.body.noteContent });
        // res.redirect("back");
        res.json(kq);
    }

    // [Delete] Delete note
    async deleteNote(req, res, next) {
        const noteId = req.params.id
        await Note.deleteOne({ _id: noteId });
        res.redirect('back');
    }

    // [Patch] Edit finish or not lesson
    async editFinish(req, res, next) {
        try {
            var userInfor = authMiddleware.userInfor(req);
            if (userInfor.id == null)
                throw { message: "Bạn phải đăng nhập trước", status: 401 };
            var doc = await UserLesson.findOne({
                user_id: userInfor.id,
                lesson_id: req.params.lessonid,
            });
            if (doc == null)
                doc = new UserLesson({
                    user_id: userInfor.id,
                    lesson_id: req.params.lessonid,
                });
            doc.rawData = req.body.rawData;
            doc.isFinish = true;
            res.json({ kq: "Thanh cong" })
            // else doc.isFinish = false;
            await doc.save();
        } catch (e) {
            console.log(e);
            next(e);
        }
    }
    
    // [GET] Check user have done lesson or not
    async getFinish(req, res, next) {
        var userInfor = authMiddleware.userInfor(req);
        if (userInfor.id == null)
            throw { message: "Bạn phải đăng nhập trước", status: 401 };
        var doc = await UserLesson.findOne({
            user_id: userInfor.id,
            lesson_id: req.params.lessonid,
        });
        if (doc.isFinish === true) {
            res.json({ kq: "Thanh cong" });
        }
        else {
            res.json({ kq: "That bai" });
        }
    }
}

module.exports = new ApiController();