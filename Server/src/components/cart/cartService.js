const cartModel = require("./cartModel")
const CustomError = require("../../HandleError");
const LIMIT = require("../public method/constant");
const { totalPages } = require("../public method/page");
const ProductModel = require("../product/ProductModel");



const deleteCart = async (cartID) => {
    try {
        const result = cartModel.findByIdAndDelete(cartID)
        if (!result)
            throw new CustomError("Couldn't delete your carts. (Service)")
        return result
    } catch (error) {
        console.log("Delete your carts error (Service): " + error);
        return false;
    }
}
const updateCart = async (cartID, updateFields) => {
    try {
        const result = cartModel.findByIdAndUpdate(
            cartID
            , updateFields, { new: true });
        if (!result)
            throw new CustomError("Couldn't update your carts. (Service)")
        return result
    } catch (error) {
        console.log("update your carts error (Service): " + error);
        return false;
    }
}
const addCart = async (addFields) => {
    try {

        const newP = new cartModel(addFields);
        return await newP.save();

    } catch (error) {
        console.log("addCart your carts error (Service): " + error);
        return false;
    }
}
const getCartsByPage = async (userId, page) => {
    try {
        let totalDocument = 0;
        const result = await cartModel.find({ userId: userId }).limit(LIMIT).skip(page);
        if (page == 0)
            totalDocument = await cartModel.find({ userId: userId }).countDocuments();
        console.log(totalDocument);
        return { result: result, pages: page == 0 && totalDocument > 0 ? totalPages(totalDocument, LIMIT) : null }
    } catch (error) {
        console.log('getAllProduct Error(Service): ' + error);
    }
}
module.exports = { deleteCart, addCart, getCartsByPage, updateCart } 
