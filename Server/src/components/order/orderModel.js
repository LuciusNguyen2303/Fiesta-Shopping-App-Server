const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const productinOrder = Schema({
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    productId: { type: ObjectId, required: true },
    variationId: { type: ObjectId },
})
const ordersSchema = new Schema({
    userId: { type: String, required: true },
    payments: { type: Object, required: true },
    shipping: { type: Object, required: true },
    modifiedOn: { type: Date, default: Date.now() },
    isHidden:{type:Boolean, default:false},
    status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'], default: 'Pending' },
    products: [productinOrder]
})

ordersSchema.index({
    'products.price': 1,
    'products.productId': 1,
    'products.variationId': 1,
    'status': 1,
    'isHidden': 1
});


module.exports = mongoose.models.orders || mongoose.model('orders', ordersSchema)