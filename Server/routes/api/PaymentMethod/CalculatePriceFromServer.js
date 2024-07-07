const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId

function DivideVariationsFromCarts(data) {
   
    let productIds = [],
        variationIds = []
    data.products.forEach(element => {
        const keys = Object.keys(element)
        if (keys.includes("productId") && !productIds.includes(element.productId))
            productIds.push(new ObjectId(element.productId))
        if (keys.includes("variationId") && !variationIds.includes(element.variationId))
            variationIds.push(new ObjectId(element.variationId))
    });
    return { productIds: productIds, variationIds: variationIds }

}
function calculatePrice(priceData, cartData) {
    let total = 0,count=0;
    for (const item of cartData) {
        if(typeof item.quantity == 'undefined') continue;
        for (const itemPrice of priceData) {
            if (item.variationId == itemPrice.variationId.toString() &&
                item.productId == itemPrice.productId.toString()) {
                total += itemPrice.price * item.quantity
                count++;
                break;
            }
        }
    }

    return total

}
function validateCarts(data) {

    if (!data)
        return false

    if (!data.products || !Array.isArray(data.products))
        return false

    if (!data.userId)
        return false
    return true
}
module.exports = {validateCarts, DivideVariationsFromCarts, calculatePrice }