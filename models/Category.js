const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);


const Schema = mongoose.Schema;

const Category = new Schema({
    nameCategory: { type: String, required: true, },
    image: {type: String, required: true},
    shortDescription: { type: String, required: true, },
    slug: { type: String, slug: 'nameCategory', unique: true },
}, {
    timestamps: true,
});


module.exports = mongoose.model('Category', Category);
