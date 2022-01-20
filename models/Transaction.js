const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Transaction = new Schema({
    user_id : { type: Schema.Types.ObjectId, ref: 'User' },
    email: {type: String, required: true},
    chargeID: {type: String, required: true},
    cartNumber: {type: String, default: ''},
    price: {type: String, default: '0'},
    status: {type: String, default: 'Denied'}
}, {
    timestamps: true,
});


module.exports = mongoose.model('Transaction', Transaction);