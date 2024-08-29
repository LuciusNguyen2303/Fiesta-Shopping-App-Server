const CustomError = require('../../HandleError')
const orderModel = require('../order/orderModel');
const { LIMIT } = require('../public method/constant');
const { totalPages } = require('../public method/page');
const productService = require('../product/ProductService');
const { default: mongoose } = require('mongoose');
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
        console.log(data.length);

        if (page <= 1)
            totalDocument = await orderModel.find({ isHidden: false, userId: userId }).countDocuments();
        let result = {}
        if (data)
            return result = { data: data, pages: page <= 1 && totalDocument > 0 ? totalPages(totalDocument, LIMIT) : null }
        return result = { data: null, pages: null }
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
            result = { data: data, pages: page <= 1 && totalDocument > 0 ? totalPages(totalDocument, LIMIT) : null }
        else
            result = { data: null, pages: null }
        return result
    } catch (error) {
        console.log("Error at getOrder (Service): " + error);
        return false;
    }
}
const getOrderById = async (orderId) => {
    try {
        console.log(orderId);

        const data = await orderModel.aggregate([
            {
                $match: {
                    "_id": new mongoose.Types.ObjectId(orderId)
                }
            },
            {
                $unwind: "$products"
            },
            {
                $lookup: {
                    from: 'products',
                    let: { productId: "$products.productId", variationId: "$products.variationId" },
                    pipeline: [
                        { $unwind: "$variations" },
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$_id", "$$productId"] },
                                        { $eq: ["$variations._id", "$$variationId"] }
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                name: 1,
                                price: 1,
                                stock: 1,
                                variation: {
                                    _id: "$variations._id",
                                    dimension: "$variations.dimension",
                                    image: "$variations.image",
                                    type: "$variations.type",
                                    SKU: "$variations.SKU",
                                    price: "$variations.price",
                                    stock: "$variations.stock"
                                }
                            }
                        }
                    ],
                    as: 'productInfo'
                }
            },
            {
                $addFields: {
                    "products.productInfo": { $arrayElemAt: ["$productInfo", 0] }
                }
            },
            {
                $group: {
                    _id: "$_id",
                    userId: { $first: "$userId" },
                    payments: { $first: "$payments" },
                    shipping: { $first: "$shipping" },
                    modifiedOn: { $first: "$modifiedOn" },
                    status: { $first: "$status" },
                    products: { $push: "$products" }
                }
            }
        ]);


        if (data)
            return data
        return null
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

        let result = false;
        const check = await orderModel.findOne({ _id: id })

        if (check.status !== status){
            result = await orderModel.findByIdAndUpdate(id, { status: status, modifiedOn: Date.now() }, { new: true });
            console.log("Service", result,status);

        }

        if (result.status == "Delivered")
            await productService.updateMinusQuantityAndSoldInQuery(result.products)

        if (result.status == "Returned")
            await productService.updatePlusQuantityAndSoldInQuery(result.products)
        console.log("Service", result);

        return result;
    } catch (error) {
        console.log("Error at updateOrder (Service): " + error);
        return false;
    }
}


module.exports = { getOrderById, updateOrder, createOrder, deleteOrder, getOrder, getOrderByUser }