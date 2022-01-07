const faker = require('faker')
const Role = require('../../models/Role.js')
const User = require('../../models/User.js')
const database = require('../index')
database.connect()
// 2 course 1 time
for(let i = 0; i <2 ; i++){
    var user_id = await User.findOne({name: 'admin'});
    var roles = new Role({
        user_id: user_id,
        roleName: faker.name.middleName()
    })
    roles.save((err,data)=>{
        if(err){
            console.log(err);
        }
    })
}