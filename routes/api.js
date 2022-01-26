var express = require("express");
var router = express.Router();

const apiController = require("../controllers/ApiController");

router.get("/category", apiController.getCategory);

router.post("/category", apiController.category);

router.get("/check-finish/:courseId/:lessonid", apiController.getFinish);

router.patch("/check-finish/:courseId/:lessonid", apiController.editFinish);

router.get('/notes/:lesson_id',apiController.getNoteByLesson);

router.post('/notes',apiController.postNote);

router.patch('/notes/:id',apiController.editNote);

router.delete('/notes/:id',apiController.deleteNote);

router.get('/notes',apiController.getNote);

module.exports = router;
