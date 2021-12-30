const Course = require('../models/Course');
const { mongooseToObject } = require('../utilities/mongoose');

class CourseController {

    // [GET] /course/:slug
    show(req, res, next) {
        Course.findOne({ slug: req.params.slug })
        .then(course => {
            res.render('courses/show', { course: mongooseToObject(course) })
        })
        .catch(next)

        // res.send('COURSE DETAIL'+ req.params.slug)
    }

    // [GET] /course/create
    create(req, res, next) {
        res.render('courses/create')
    }

    // [POST] /course/store
    store(req, res, next) {
        // res.json(req.body)
        const formData =  req.body;
        formData.image = `http://img.youtube.com/vi/${req.body.videoId}/sddefault.jpg`
        const course = new Course(req.body)
        course.save()
            .then(() => res.redirect('/me/stored/courses'))
            .catch(error => {
                
            })
    }

    // [GET] /course/:id/edit
    edit(req, res, next) {
        Course.findById(req.params.id)
            .then(course => res.render('courses/edit', {
                course: mongooseToObject(course)
            }))
            .catch(next)
        
    }

    // [PUT] /course/:id
    update(req, res, next) {
        Course.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/me/stored/courses'))
            .catch(next)
    }

    // [DELETE] /course/:id
    destroy(req, res, next){
        Course.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next)
    }

}

module.exports = new CourseController;