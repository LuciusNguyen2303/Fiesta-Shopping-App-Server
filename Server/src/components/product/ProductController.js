const productService = require('./ProductService')
const addProduct = async (
    name, price, quantity
) => {
    try {
        return await productService.addProduct(
            name, price, quantity
        );
    } catch (error) {
        console.log('addProduct error(Controller): ' + error);
    }
};
const getAllProduct = async () => {
    try {
        return await productService.getAllProduct()
    } catch (error) {
        console.log('getAllProduct error(Controller): ' + err);  
    }
}
const updateProduct = async (productID, updateFields) => {
    try {
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
const searchProducts = async (searchFileds) => {
    try {
        return await productService.searchProducts(searchFileds)
    } catch (error) {
        console.log('getProductByID Error(Controller): ' + error);
    }
}
module.exports = {addProduct, getAllProduct, updateProduct, getProductByID, searchProducts}