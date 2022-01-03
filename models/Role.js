const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const Role = new Schema({
    user_id : { type: Schema.Types.ObjectId, ref: 'User' },
    roleName: { type: String, required: true, },
}, {
    timestamps: true,
});


module.exports = mongoose.model('Role', Role);
