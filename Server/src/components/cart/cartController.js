const { skip } = require('../public method/page');
const cartService = require('./cartService')
const LIMIT = require('../public method/constant');
const CustomError = require("../../HandleError");

const addCarts = async (addFields) => {
    try {
        if (!addFields)
            throw new CustomError("No info to add in addFields", 500)
        const keys = Object.keys(addFields);
        if (!keys.includes("userId") || !keys.includes("productId") || !keys.includes("variationId") || !keys.includes("quantity"))
            throw new CustomError("No userId or products in addFields", 500)

        return await cartService.addCart(addFields)
    } catch (error) {
        console.log('addCart error(Controller): ' + error);
        return false;
    }
}
const getCartsByPage = async (userId, page) => {

    // try {
    if (!userId || !page)
        throw new CustomError("No userId or page !", 500)
    console.log(">>>>>>CONTROLLER", skip(LIMIT, page));

    return await cartService.getCartsByPage(userId, skip(LIMIT, page))
    // } catch (error) {
    //     console.log('getCartsByPage error(Controller): ' + error);
    //     return false;
    // }
}
const updateCart = async (cartID, updateFields) => {

    try {
        if (!cartID)
            throw new CustomError("No cart id ", 500)
        if (!updateFields)
            throw new CustomError("No updateFields ", 500)

        return await cartService.updateCart(cartID, updateFields)
    } catch (error) {
        console.log('updateCart error(Controller): ' + error);
        return false;
    }
}
const deleteCart = async (cartID) => {
    try {
        if (!cartID)
            throw new CustomError("No cartID !!!", 500)


        return await cartService.deleteCart(cartID)
    } catch (error) {
        console.log('deleteCart error(Controller): ' + error);
        return false;
    }
}
const deleteManyCarts = async (cartID) => {
    try {
        if (!cartID)
            throw new CustomError("No cartID !!!", 500)


        return await cartService.deleteManyCarts(cartID)
    } catch (error) {
        console.log('deleteCart error(Controller): ' + error);
        return false;
    }
}
const getCartByIds = async (getFields, userId) => {
    try {
        if (!userId)
            throw new CustomError("error getFields or userId !!!", 500)


        return await cartService.getCartByIds(getFields, userId)
    } catch (error) {
        console.log('get cart by ids error(Controller): ' + error);
        return false;
    }
}
module.exports = {
    deleteManyCarts,
    addCarts,
    getCartsByPage,
    deleteCart,
    updateCart,
    getCartByIds
}