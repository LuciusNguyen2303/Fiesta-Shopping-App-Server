const productService = require('./ProductService')
const CustomError = require("../../HandleError");
const { skip } = require('../public method');
const LIMIT = require('../public method/constant');
const addProduct = async (
    addFields
) => {
    try {

        if (!addFields.category || !addFields.name)
            throw new CustomError("Must have category and name", 500);
        if (!addFields.variations) {
            if (!addFields.images)
                throw new CustomError("Must have the images if don't have variations", 500);
            if (!addFields.stock)
                throw new CustomError("Must have the stock if don't have variations", 500);
            if (!addFields.price)
                throw new CustomError("Must have the price if don't have variations", 500);

            return await productService.addProduct(
                addFields
            );
        }
        return await productService.addProduct(
            addFields
        );
    } catch (error) {
        console.log('addProduct error(Controller): ' + error);
        return false;
    }
};
const getAllProduct = async () => {
    try {
        return await productService.getAllProduct()
    } catch (error) {
        console.log('getAllProduct error(Controller): ' + err);
    }
}
const findPriceInProducts = async (data) => {
    try {
        if (!data.productIds || !Array.isArray(data.productIds))
            return null
        if (!data.variationIds || !Array.isArray(data.variationIds))
            return null
        return await productService.findPriceInProducts(data)
    } catch (error) {
        console.log('getAllProduct error(Controller): ' + err);
    }
}

const getProductsByPage = async (page) => {
    try {
        console.log(skip(LIMIT, page));

        return await productService.getProductsByPage(skip(LIMIT, page))
    } catch (error) {
        console.log('getAllProduct error(Controller): ' + err);
        return false;
    }
}
const updateProduct = async (productID, updateFields) => {
    try {
        if (!productID)
            throw new CustomError("No product id.", 500)
        if (!updateFields)
            throw new CustomError("No updateFields.", 500)
        if (Object.keys(updateFields).includes("variations")) {
            myArr = updateFields.variations;
            if (myArr) {
                myArr.forEach(item => {
                    if (!item._id)
                        throw new CustomError("No id in items in Variations.", 500)
                });
            } else
                throw new CustomError("No items in Variations.", 500)

        }

        return await productService.updateProduct(productID, updateFields)
    } catch (error) {
        console.log('updateProduct Error(Controller): ' + error);
        return false;
    }
}
const getProductByID = async (productID) => {
    try {
        return await productService.getProductByID(productID)
    } catch (error) {
        console.log('getProductByID Error(Controller): ' + error);
        return false;
    }
}
const deleteVariation = async (productID, updateFields) => {
    try {
        if (!productID)
            throw new Error("No productID")
        
        if (
            typeof updateFields.variation._id == 'undefined')
            throw new Error("No image or _id !!!")
        return await productService.deleteVariation(productID, updateFields)
    } catch (error) {
        console.log('deleteVariation Error(Controller): ' + error);
        return false;
    }
}
const updateVariation = async (productID, updateFields) => {
    try {
        
        if (!productID)
            throw new Error("No productID")
        if (typeof updateFields.variation == "undefined" ||
            typeof updateFields.variation._id == 'undefined')
            throw new Error("No variation or variationId  !!!")
        return await productService.updateVariation(productID, updateFields)
    } catch (error) {
        console.log('updateVariation Error(Controller): ' + error);
        return false;
    }
}
const addNewVariation = async (productID, addFields) => {
    try {
        if (!productID)
            throw new Error("No productID")
        if (!addFields )
            throw new Error("No variation available  !!!")
        if (!Object.keys(addFields).length>5 )
            throw new Error("Attributes in variation is not enough  !!!")

        return await productService.addNewVariation(productID, addFields)
    } catch (error) {
        console.log('updateVariation Error(Controller): ' + error);
        return false;
    }
}
const deleteProduct = async (productIDs) => {
    try {
        if (!productIDs)
            throw new CustomError("No product id. (Controller) ", 500)
        return await productService.deleteProduct(productIDs)
    } catch (error) {
        console.log('getProductByID Error(Controller): ' + error);
        return false;
    }
}

const searchProducts = async (searchFields) => {
    try {
        return await productService.searchProducts(searchFields)
    } catch (error) {
        console.log('getProductByID Error(Controller): ' + error);
        return false;
    }
}
const checkProductVariationStock = async (checkFields) => {
    try {
        if (checkFields) {
            return await productService.checkProductVariationStock(checkFields)
        }
        return null;
    } catch (error) {
        console.log('checkProductVariationStock Error(Controller): ' + error);
        return false;
    }
}
const getProductListByStandard = async (type) => {
    try {
        if (typeof type !== "string")
            throw new CustomError("type must be a string !!!")

        return await productService.getProductListByStandard(type)
    } catch (error) {
        console.log('getProductListByStandard error(Controller): ' + err);
        return null;
    }
}
const getStockProduct = async (productId, variationId) => {
    try {
        if (typeof productId !== "string")
            throw new CustomError("type must be a string !!!")

        return await productService.getStockProduct(productId, variationId)
    } catch (error) {
        console.log('getProductListByStandard error(Controller): ' + err);
        return null;
    }
}
const getStockManyProduct = async (items) => {
    try {
        if (typeof items == "undefined" && !Array.isArray(items))
            throw new CustomError("type must be a items !!!")

        return await productService.getStockManyProducts(items)
    } catch (error) {
        console.log('getProductListByStandard error(Controller): ' + error);
        return null;
    }
}
module.exports = { getStockManyProduct, getStockProduct, getProductListByStandard, findPriceInProducts, deleteProduct, addProduct, deleteVariation, addNewVariation, updateVariation, getProductsByPage, getAllProduct, updateProduct, getProductByID, searchProducts, checkProductVariationStock }
