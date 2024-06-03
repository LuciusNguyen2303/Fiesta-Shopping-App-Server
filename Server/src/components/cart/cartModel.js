const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectID = mongoose.Types.ObjectId
const productinCart = Schema({
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    productId: { type: ObjectID, required: true },
    variationId: { type: ObjectID },
})
const cartSchema = Schema({
    userId: { type: String, required: true },
    modifiedOn:{type: Date,default:Date.now()},
    products: [productinCart]
});

module.exports = mongoose.models.carts || mongoose.model("carts", cartSchema)