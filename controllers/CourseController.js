const Course = require('../models/Course');
const { mongooseToObject } = require('../utilities/mongoose');

class CourseController {

    // [GET] /course/:slug
    async show(req, res, next) {

        try {
            var courses = await Course.findOne({ slug: req.params.slug })
            res.render('courses/show', { course: mongooseToObject(courses) })
        } catch (e) {
            console.log(e)
            res.json(e)
        }
    }

    // [GET] /course/create
    create(req, res, next) {
        res.render('courses/create')
    }

    // [POST] /course/store
    async store(req, res, next) {
        const formData = req.body;
        formData.image = `http://img.youtube.com/vi/${req.body.videoId}/sddefault.jpg`
        const course = new Course(req.body)

        try {
            await course.save()
            res.redirect('/me/stored/courses')
        } catch (e) {
            console.log(e)
            res.json(e)
        }
    }

    // [GET] /course/:id/edit
    async edit(req, res, next) {

        try {
            var course = await Course.findById(req.params.id)
            res.render('courses/edit', {
                course: mongooseToObject(course)
            })
        } catch (e) {
            console.log(e)
            res.json(e)
        }
    }

    // [PUT] /course/:id
    async update(req, res, next) {

        try {
            await Course.updateOne({ _id: req.params.id }, req.body)
            res.redirect('/me/stored/courses')
        } catch (e) {
            console.log(e)
            res.json(e)
        }
    }

    // [DELETE] /course/:id
    async destroy(req, res, next) {

        try {
            await Course.deleteOne({ _id: req.params.id })
            res.redirect('back')
        } catch (e) {
            console.log(e)
            res.json(e)
        }
    }

}

module.exports = new CourseController;