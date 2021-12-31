const faker = require('faker')
const Course = require('../../models/Course.js')
const database = require('../index')
database.connect()

for(let i = 0; i <2 ; i++){
    var courses = new Course({
        name: faker.commerce.productName(),
        author: faker.name.firstName(),
        price: faker.commerce.price(),
        image: faker.image.imageUrl(),
        slug: faker.lorem.slug(),
        videoId: "4ktgK9PaTb8",
    })
    courses.save((err,data)=>{
        if(err){
            console.log(err);
        }
    })
}