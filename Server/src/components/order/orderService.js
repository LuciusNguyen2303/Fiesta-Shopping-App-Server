const CustomError = require('../../HandleError')
const orderModel = require('../order/orderModel');
const LIMIT = require('../public method/constant');
const { totalPages } = require('../public method/page');
const productModel = require('../product/ProductService')
const createOrder = async (addFields) => {
    try {
        const result = new orderModel(addFields);
        return await result.save();
    } catch (error) {
        console.log("Error at createOrder (Service): " + error);
        return false;
    }
}
const getOrderByUser = async (userId, page) => {
    try {

        const data = await orderModel.find({ isHidden: false, userId: userId }).limit(LIMIT).skip(page);
        let totalDocument = 0
        if (page == 0)
            totalDocument = await orderModel.find({ isHidden: false, userId: userId }).countDocuments();
        let result = {}
        console.log(totalDocument);
        if (data)
            result = { data: data, pages: page == 0 && totalDocument > 0 ? totalPages(totalDocument, LIMIT) : null }
        else
            result = { data: null, pages: null }
        return result
    } catch (error) {
        console.log("Error at createOrder (Service): " + error);
        return false;
    }
}
const getOrder = async (page) => {
    try {
        const data = await orderModel.find({ isHidden: false }).limit(LIMIT).skip(page);
        let totalDocument = 0
        if (page == 0)
            totalDocument = await orderModel.find({ isHidden: false }).countDocuments();
        let result = {}
        if (data)
            result = { data: data, pages: page == 0 && totalDocument > 0 ? totalPages(totalDocument, LIMIT) : null }
        else
            result = { data: null, pages: null }
        return result
    } catch (error) {
        console.log("Error at getOrder (Service): " + error);
        return false;
    }
}
const deleteOrder = async (userId) => {
    try {
        const result = await orderModel.findByIdAndUpdate(userId, { isHidden: true }, { new: true })
        return result;
    } catch (error) {
        console.log("Error at createOrder (Service): " + error);
        return false;
    }
}
const updateOrder = async (id, status) => {
    try {
        console.log(JSON.stringify(status));
        let result = false;
        const check = await orderModel.findOne({ _id: id })
        if (check.status !== "Delivered")
            result = await orderModel.findByIdAndUpdate(id, { status: status });
        if (result.status == "Delivered")
            productModel.updateQuantityEachVariationQuery(result.products)
       console.log(result);
        return result;
    } catch (error) {
        console.log("Error at createOrder (Service): " + error);
        return false;
    }
}


module.exports = { updateOrder, createOrder, deleteOrder, getOrder, getOrderByUser }