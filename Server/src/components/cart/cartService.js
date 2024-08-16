const cartModel = require("./cartModel")
const CustomError = require("../../HandleError");
const { LIMIT } = require("../public method/constant");
const { totalPages } = require("../public method/page");
const ProductModel = require("../product/ProductModel");
const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types


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

const deleteManyCarts = async (cartIDs) => {
    try {
        const result = cartModel.deleteMany({ _id: { $in: cartIDs } })
        if (!result)
            throw new CustomError("Couldn't delete your carts. (Service)")
        return result
    } catch (error) {
        console.log("Delete your carts error (Service): " + error);
        return false;
    }
}
const updateCart = async (cartID, updateFields) => {
    // try {

    const result = await cartModel.findByIdAndUpdate(
        cartID
        , updateFields, { new: true });
    console.log(result, cartID, updateFields);
    // if (!result)
    //     throw new CustomError("Couldn't update your carts. (Service)")
    return result
    // } catch (error) {
    //     console.log("update your carts error (Service): " + error);
    //     return false;
    // }
}
const addCart = async (addFields) => {
    try {
        const checked = await cartModel.findOne({ userId: addFields.userId, productId: addFields.productId, variationId: addFields.variationId })
        if (checked)
            return await cartModel.findOneAndUpdate({ _id: checked._id }, { quantity: checked.quantity + addFields.quantity })
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
        console.log(userId, page, LIMIT);
        const result = await cartModel.aggregate([
            {
                $match: {
                    userId: userId,
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "products",
                },
            },
            {
                $unwind: "$products",
            },
            {
                $project: {
                    _id: 1,
                    userId: 1,
                    quantity: 1,
                    variationId: 1,
                    "products._id": 1,
                    "products.name": 1,
                    "products.price": 1,
                    "products.stock": 1,
                    "products.variations": {
                        $filter: {
                            input: "$products.variations",
                            as: "variation",
                            cond: {
                                $in: ["$$variation._id", ["$variationId"]],
                            },
                        },
                    },
                },
            },
        ]).limit(LIMIT).skip(page);
        let newData =null
        console.log(result);
        
        if(result) 
            newData=result.map((item,index)=>{
        const stockItemVariation = item.products.variations[0].stock
                    return{...item,isStockSufficient:item.quantity<=stockItemVariation}
            })
        // const result = await cartModel.find({ userId: userId }).limit(LIMIT).skip(page);
        if (page == 0)
            totalDocument = await cartModel.find({ userId: userId }).countDocuments();
        console.log(">>>>>",totalDocument);
        return { result: newData?newData:result, pages: page == 0 && totalDocument > 0 ? totalPages(totalDocument, LIMIT) : null }
    } catch (error) {
        console.log('getAllProduct Error(Service): ' + error);
    }
}
const getCartByIds = async (getFields, userId) => {
    try {
        const objectIdFields = getFields.map(id => new ObjectId(id));

        const result = await cartModel.aggregate([
            {
                $match: {
                    userId: userId,
                    _id: { $in: objectIdFields }
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "products",
                },
            },
            {
                $unwind: "$products",
            },
            {
                $project: {
                    _id: 1,
                    userId: 1,
                    quantity: 1,
                    variationId: 1,
                    "products._id": 1,
                    "products.name": 1,
                    "products.price": 1,
                    "products.stock": 1,
                    "products.variations": {
                        $filter: {
                            input: "$products.variations",
                            as: "variation",
                            cond: {
                                $in: ["$$variation._id", ["$variationId"]],
                            },
                        },
                    },
                },
            },
        ])
        const countDocuments = await cartModel.find({
            userId: userId,
            _id: { $in: objectIdFields }
        }).countDocuments()
        if (result)
            return {
                result: result,
                documents: countDocuments
            }
        return []
    } catch (error) {
        console.log('get cart by ids Error(Service): ' + error);
    }
}
module.exports = { deleteManyCarts, deleteCart, addCart, getCartsByPage, updateCart, getCartByIds } 
