const cartModel = require("./cartModel")
const CustomError = require("../../HandleError");
const LIMIT = require("../public method/constant");
const { totalPages } = require("../public method/page");
const ProductModel = require("../product/ProductModel");
const generateDeleteQueryCarts = (variationIds) => {
    let arrayFilter = []
    let queryUpdate = {};
    variationIds.forEach((item, index) => {
        let keyArr = `elements${index}`;
        let keyItem = `products.$[${keyArr}]`

        queryUpdate = {
            ...queryUpdate,
            $pull: {
                products: { variationId: item }
            }

        }
        arrayFilter.push({ [keyArr + "._id"]: item })

    })
    return { arrayFilter: arrayFilter, queryDelete: queryUpdate }
}

function generateUpdateQueryVariations(updateFields) {
    let queryUpdate = {
        $set: {

        }
    }
    let arrayFilter = [
    ]
    try {
        updateFields.products.forEach((item, index) => {
            let productsKeys = Object.keys(item);
            if (productsKeys.length > 1) {
                const _id = item._id;
                let keyArr = `elements${index}`;

                productsKeys.forEach(async (itemProducts, index) => {
                    let key = `products.$[${keyArr}].${itemProducts}`
                    if (itemProducts == "variationId" || itemProducts == "quantity"|| itemProducts == "status") {
                        queryUpdate = {
                            ...queryUpdate,
                            $set: {
                                ...queryUpdate.$set,
                                [key]: item[itemProducts],
                                'modifiedOn':new Date.now()
                            }
                        };


                    }
                })
                arrayFilter.push({ [keyArr + "._id"]: _id })
            }
        })
        console.log(JSON.stringify(queryUpdate), JSON.stringify(arrayFilter));

    } catch (error) {
        console.log("ERROR generateQueryVariations: " + error);
    }


    return { query: queryUpdate, filter: arrayFilter }

}
const deleteCart = async (cartID, variationIds) => {
    try {
        const deleteQueryResult = generateDeleteQueryCarts(variationIds)
        const result = cartModel.findByIdAndUpdate(cartID,
            deleteQueryResult.queryDelete
            , deleteQueryResult.arrayFilter
        );
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

        const queryUpdate = generateUpdateQueryVariations(updateFields)
        const result = cartModel.findByIdAndUpdate(
            cartID
            , queryUpdate.query, { arrayFilters: queryUpdate.filter, new: true });
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

        const { userId, products } = addFields;
        const checkUserCart = await cartModel.findOne({ userId: userId }, { products: { $elemMatch: { "variationId": products.variationId } } })
        if (checkUserCart) {
            let checkProduct = false;
            let query = {

            }
            let arrayFilter = [

            ]
            checkUserCart.products.forEach((item, index) => {
                if (item.variationId == products.variationId) {
                    checkProduct = true;
                    query = {
                        ...query,
                        $set: {
                            [`products.$[x].quantity`]: products.quantity + item.quantity
                        }
                    }
                    arrayFilter.push({ ["x.variationId"]: item.variationId })
                    console.log(JSON.stringify(query), JSON.stringify(arrayFilter));
                    return
                }

            })
            if (checkProduct && Object.keys(query).length > 0)
                return await cartModel.findByIdAndUpdate(
                    checkUserCart._id,
                    query
                    , { arrayFilters: arrayFilter, new: true });
            return await cartModel.findByIdAndUpdate(checkUserCart._id, { $push: { products: products } }, { new: true });
        }
        const newP = new cartModel(addFields);
        console.log(checkUserCart);
        return true

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
