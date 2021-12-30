const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const Schema = mongoose.Schema;

const Course = new Schema({
    name: { type: String, required: true, },
    author: { type: String },
    price: { type: String, maxLength: 24 },
    image: { type: String },
    slug: { type: String, slug: 'name', unique: true },
    videoId: { type: String, required: true, },
}, {
    timestamps: true,
});


module.exports = mongoose.model('Course', Course);
