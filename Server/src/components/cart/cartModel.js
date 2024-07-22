const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectID = mongoose.Types.ObjectId
const cartSchema = Schema({
    userId: { type: String, required: true },
    modifiedOn:{type: Date,default:Date.now()},
    quantity: { type: Number, required: true },
    productId: { type: ObjectID, required: true,ref:'products' },
    variationId: { type: ObjectID }
});

module.exports = mongoose.models.carts || mongoose.model("carts", cartSchema)