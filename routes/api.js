var express = require("express");
var router = express.Router();

const apiController = require("../controllers/ApiController");

router.get("/check-finish/:courseId/:lessonid", apiController.getFinish);

router.patch("/check-finish/:courseId/:lessonid", apiController.editFinish);

router.post('/notes',apiController.postNote);

router.patch('/notes/:id',apiController.editNote);

router.delete('/notes/:id',apiController.deleteNote);

router.get('/notes',apiController.getNote);

module.exports = router;
