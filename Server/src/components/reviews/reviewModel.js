const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId

const reviewsSchema = new Schema({
    userId: { type: ObjectId, ref: 'users', required: true },
    productId: { type: ObjectId, ref: 'products', required: true },
    reviews: { type: String },
    images: [
        {
            id: { type: String },
            _id: false,
            url: { type: String }
        }
    ],
    createAt:{type:Date, default:new Date()},
    rating: { type: Number, required: true, index: true }
})

module.exports = mongoose.models.reviews || mongoose.model("reviews", reviewsSchema)

