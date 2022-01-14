const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Transaction = new Schema({
    user_id : { type: Schema.Types.ObjectId, ref: 'User' },
    email: {type: String, required: true},
    chargeID: {type: String, required: true},
    cartNumber: {type: String, required: true},
    price: {type: Number, default: 0},
    status: {type: Boolean, default: false}
}, {
    timestamps: true,
});


module.exports = mongoose.model('Transaction', Transaction);