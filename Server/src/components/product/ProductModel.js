const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = new Schema({
    name: { type: String },
    price: { type: Number },
    quantity: { type: Number },
    rating: { type: Number, default: 0 }
});
module.exports = mongoose.models.products || mongoose.model('products', productSchema)