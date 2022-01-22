const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const User = new Schema({
    role_id : { type: Schema.Types.ObjectId, ref: 'Role', default:'61d3013e7a17cb27753513cd' },
    username: { type: String, required: true, },
    password: { type: String, required: true, },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: ''},
    email: { type: String, default: ''},
    isActive : { type: Boolean, default : true },
}, {
    timestamps: true,
}, { collection: 'users' }
);


module.exports = mongoose.model('User', User);