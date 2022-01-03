const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Category = new Schema({
    nameCategory: { type: String, required: true, },
    shortDescription: { type: String, required: true},
}, {
    timestamps: true,
});


module.exports = mongoose.model('Category', Category);