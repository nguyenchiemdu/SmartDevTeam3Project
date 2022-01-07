const faker = require('faker')
const Course = require('../../models/Course.js')
const UserCourse = require('../../models/UserCourse.js')
const User = require('../../models/User.js')
const database = require('../index')
database.connect()
// 2 course 1 time
let seed = async() =>{
    for(let i = 0; i <2 ; i++){

            var course_id = await Course.findOne({nameCategory: 'Business'});
            var user_id = await User.findOne({name: 'admin'});
            var usercourses = new UserCourse({
                course_id: course_id,
                user_id: user_id,
                totalPayout: faker.commerce.price()
            })
            usercourses.save((err,data)=>{
                if(err){
                    console.log(err);
                }
            })

        }
}

seed();
