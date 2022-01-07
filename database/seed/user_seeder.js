const faker = require('faker')
const Role = require('../../models/Role.js')
const User = require('../../models/User.js')
const database = require('../index')
database.connect()
// 2 course 1 time

for(let i = 0; i <2 ; i++){
    let seed = async() =>{
        var role_id = await Role.findOne({nameRole: 'Business'});
        var users = new User({
            role_id: role_id,
            username: faker.internet.username(),
            password: faker.internet.password(),
            email: faker.internet.email()
        })
        users.save((err,data)=>{
            if(err){
                console.log(err);
            }
        })
    }
    seed();

}