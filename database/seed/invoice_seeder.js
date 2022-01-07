const faker = require('faker')
const Course = require('../../models/Course.js')
const Invoice = require('../../models/Invoice.js')
const User = require('../../models/User.js')
const database = require('../index')
database.connect()
// 2 course 1 time

for(let i = 0; i <2 ; i++){
    let seed = async() =>{
        var course_id = await Course.findOne({nameCategory: 'Business'});
        var user_id = await User.findOne({name: 'admin'});
        var invoices = new Invoice({
            course_id: course_id,
            user_id: user_id,
            totalPayout: faker.commerce.price()
        })
        invoices.save((err,data)=>{
            if(err){
                console.log(err);
            }
        })
    }
    seed();

}