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
module.exports = {addProduct, getAllProduct}