const faker = require('faker')
const Course = require('../../models/Course.js')
const Category = require('../../models/Category.js')
const User = require('../../models/User.js')
const Role = require('../../models/Role.js')
const database = require('../index')
database.connect()
// 2 course 1 time
// for(let i = 0; i <1 ; i++){
//     // var courses = new Course({
//     //     name: faker.commerce.productName(),
//     //     author: faker.name.firstName(),
//     //     price: faker.commerce.price(),
//     //     image: faker.image.imageUrl(),
//     //     slug: faker.lorem.slug(),
//     //     videoId: "4ktgK9PaTb8",
//     // })
//     // courses.save((err,data)=>{
//     //     if(err){
//     //         console.log(err);
//     //     }
//     // })
//     // var categories = new Category({
//     //     nameCategory: faker.commerce.productName(),
//     //     shortDescription: faker.commerce.productDescription()s
//     // })
//     // categories.save((err,data)=>{
//     //     if(err){
//     //         console.log(err);
//     //     }
//     // })
//     // var roles = new Role({
//     //     roleName: faker.name.jobArea(),
//     // })
//     // roles.save((err,data)=>{
//     //     if(err){
//     //         console.log(err);
//     //     }
//     // })
    
//     // let getRole = async() =>{
//     //     var role = await Category.findOne({nameCategory: 'Business'})
//     //     const user = new User({
//     //         username: faker.internet.userName(),
//     //         password: faker.internet.password(),
//     //         role_id: role._id
//     //     })
//     //     user.save((err)=>{
//     //         if(err) return handleError(err);
//     //     })
//     // }
//     // getRole();
 
      
//     //   user.save(function (err) {
//     //     if (err) return handleError(err);
      
 
        
//     //     const role = new Role({
//     //         roleName: faker.name.jobArea(),
//     //         user_id: user._id    // assign the _id from the person
//     //     });
      
//     //     role.save(function (err) {
//     //       if (err) return handleError(err);
//     //       // that's it!
//     //     });
//     //   });

  
    // User.
    // findOne({ username: 'Wilbert.Raynor22'}).
    // populate('role_id').
    // exec(function (err, role) {
    //   console.log('The role is %s', role);
    //   // prints "The author is Ian Fleming"
    // });
    
// }
    var kq;
    const test = async() =>{
    const k = await Category.findOne({nameCategory: 'Business'})
    kq = k._id;
    }
 
    const fun = async() =>{
        await test();
        Course.find({categories_id: kq}).populate({
                path: 'categories_id',
            }).exec((err,course)=>{
                console.log(course);
            }) 
        
    }
    fun()
    
    

