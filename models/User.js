const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    // role_id : { type: Schema.Types.ObjectId, ref: 'Role' },
    username: { type: String, required: true, },
    password: { type: String, required: true, },
    email: { type: String, required: true, },
    }, { collection: 'users' }
)

const model = mongoose.model('UserSchema', UserSchema)

module.exports = model