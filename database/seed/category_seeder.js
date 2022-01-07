const faker = require('faker')
const Category = require('../../models/Category.js')
const database = require('../index')
database.connect()
// 2 course 1 time
for(let i = 0; i <2 ; i++){
    var categories = new Category({
        nameCategory: faker.commerce.productName(),
        shortDescription: faker.lorem.paragraph(),
        image: faker.image.imageUrl(),
        slug: faker.lorem.slug()
    })
    categories.save((err,data)=>{
        if(err){
            console.log(err);
        }
    })
}