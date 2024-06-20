const productService = require('./ProductService')
const CustomError = require("../../HandleError");
const { skip } = require('../public method');
const LIMIT = require('../public method/constant');
const addProduct = async (
    category, name, images, price, stock, brand, rating, Description, variations
) => {
    try {
        if (!category || !name)
            throw new CustomError("Must have category and name", 500);
        if (!variations) {
            if (!images)
                throw new CustomError("Must have the images if don't have variations", 500);
            if (!stock)
                throw new CustomError("Must have the stock if don't have variations", 500);
            if (!price)
                throw new CustomError("Must have the price if don't have variations", 500);

            console.log();
            return await productService.addProduct(
                category, name, images, price, stock, brand, rating, Description
            );
        }
        return await productService.addProduct(
            category, name, images, price, stock, brand, rating, Description, variations
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
const getProductsByPage = async (page) => {
    try {
        console.log(skip(LIMIT, page));

        return await productService.getProductsByPage(skip(LIMIT, page))
    } catch (error) {
        console.log('getAllProduct error(Controller): ' + err);
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
    }
}
const getProductByID = async (productID) => {
    try {
        return await productService.getProductByID(productID)
    } catch (error) {
        console.log('getProductByID Error(Controller): ' + error);
    }
}
const deleteAttributesInProduct = async (productID, updateFields) => {
    try {
        return await productService.deleteAttributesInProduct(productID, updateFields)
    } catch (error) {
        console.log('getProductByID Error(Controller): ' + error);
    }
}
const deleteProduct = async (productIDs) => {
    try {
        if (!productIDs)
            throw new CustomError("No product id. (Controller) ", 500)
        return await productService.deleteProduct(productIDs)
    } catch (error) {
        console.log('getProductByID Error(Controller): ' + error);
    }
}
const searchProducts = async (searchFields) => {
    try {
        return await productService.searchProducts(searchFields)
    } catch (error) {
        console.log('getProductByID Error(Controller): ' + error);
    }
}
const checkProductVariationStock = async (productID, size, color) => {
    try {
        if (productID) {
            if (!size) {
                return null;
            }
            if (!color) {
                return null;
            }
            return await productService.checkProductVariationStock(productID, size, color)
        }
        return false;
    } catch (error) {

    }
}
module.exports = { deleteProduct, addProduct, deleteAttributesInProduct, getProductsByPage, getAllProduct, updateProduct, getProductByID, searchProducts, checkProductVariationStock }