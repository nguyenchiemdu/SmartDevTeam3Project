const faker = require('faker')
const Category = require('../../models/Category.js')
const User = require('../../models/User.js')
const Course = require('../../models/Course.js')
const database = require('../index')
database.connect()
// 2 course 1 time

for(let i = 0; i <2 ; i++){
    let seed = async() =>{
        var categories_id = await Category.findOne({nameCategory: 'Business'});
        var user_id = await User.findOne({name: 'admin'});
        var courses = new Course({
            categories_id: categories_id,
            user_id: user_id,
            name: faker.commerce.productName(),
            image: faker.image.imageUrl(),
            shortDescription: faker.lorem.paragraph(),
            description: faker.lorem.paragraphs(),
            slug: faker.lorem.slug()
        })
        courses.save((err,data)=>{
            if(err){
                console.log(err);
            }
        })
    }
    seed();

}