const faker = require('faker')
const Course = require('../../models/Course.js')
const Lesson = require('../../models/Lesson.js')
const database = require('../index')
database.connect()
// 2 course 1 time

for(let i = 0; i <2 ; i++){
    let seed = async() =>{
        var course_id = await Course.findOne({name: 'Business'});
        var lessons = new Lesson({
            course_id: course_id,
            urlVideo: faker.internet.url(),
            title: faker.name.title(),
            image: faker.image.imageUrl(),
            description: faker.lorem.paragraphs()
        })
        lessons.save((err,data)=>{
            if(err){
                console.log(err);
            }
        })
    }
    seed();

}