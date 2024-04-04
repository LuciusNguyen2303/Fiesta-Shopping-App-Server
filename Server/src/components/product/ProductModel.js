const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const productSchema = new Schema({
    name: { type: String },
    price: { type: Number },
    quantity: { type: Number },
    rating: { type: Number, default: 0 }
});
module.exports = mongoose.models.product || mongoose.model('products', productSchema)