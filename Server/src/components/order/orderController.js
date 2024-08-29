const orderService = require("./orderService")
const CustomError = require('../../HandleError');
const {LIMIT} = require("../public method/constant");
const { skip } = require("../public method/page");

const createOrder = async (
    userId, payments, shipping, products
) => {
    try {
        if (!userId)
            throw new CustomError("Must have the userId", 500);
        if (!products)
            throw new CustomError("Must have the purchased products", 500);
        if (!payments)
            throw new CustomError("Must have the payment methods and amount", 500);

        const addFields = { userId:userId, payments:payments, shipping:shipping, products:products }

        return await orderService.createOrder(
            addFields
        );
    } catch (error) {
        console.log('createOrder error(Controller): ' + error);
        return false;
    }
};
const getOrderByUser = async (userId, page) => {
    try {
        if (!page)
            throw new CustomError("Must have page !!", 500)
        if (!userId)
            throw new CustomError("Must have userId !!", 500)
        console.log("ORDERS",page);
        
        console.log("SKIP ORDERS",skip(LIMIT, page));

        return await orderService.getOrderByUser(userId, skip(LIMIT, page))
    } catch (error) {
        console.log('getOrderByUser error(Controller): ' + error);
    }
}
const getOrder = async (page) => {
    try {
        if (!page)
            throw new CustomError("No requested page!!!", 500)
        const data = await orderService.getOrder(skip(LIMIT, page))
        return data
    } catch (error) {
        console.log('getOrder error(Controller): ' + error);
    }
}
const getOrderById = async (orderId) => {
    try {
        if (!orderId)
            throw new CustomError("No orderId!!!", 500)
        const data = await orderService.getOrderById(orderId)
        return data
    } catch (error) {
        console.log('orderId error(Controller): ' + error);
    }
}
const deleteOrder = async (userId) => {
    try {
        if (!userId)
            throw new CustomError("No userId. (Controller) ", 500)
        return await orderService.deleteOrder(userId)
    } catch (error) {
        console.log('deleteOrder Error(Controller): ' + error);
    }
}
const updateOrder = async (id, status) => {
    try {
        
        if (!id || !status)
            throw new CustomError("No userId or updateFields. (Controller) ", 500)
        return await orderService.updateOrder(id, status)
    } catch (error) {
        console.log('updateOrder Error(Controller): ' + error);
    }
}
module.exports = { getOrderById,createOrder, updateOrder, deleteOrder, getOrder, getOrderByUser }