const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const Schema = mongoose.Schema;

const Course = new Schema({
    categories_id : { type: Schema.Types.ObjectId, ref: 'Category' },
    user_id : { type: Schema.Types.ObjectId, ref: 'Users' },
    name: { type: String, required: true, },
    image: { type: String, required: true, },
    shortDescription: { type: String, required: true},
    description: { type: String, required: true},
    price: { type: String, maxLength: 24 },
    slug: { type: String, slug: 'name', unique: true },
    isValidated: { type: Number, required: true}
    // name: { type: String, required: true},
    // author: { type: String, required: true},
    // price: { type: String, required: true},
    // image: { type: String, required: true},
    // slug: { type: String, slug: 'name', unique: true },
    // videoId: { type: String, required: true},
}, {
    timestamps: true,
});


module.exports = mongoose.model('Course', Course);