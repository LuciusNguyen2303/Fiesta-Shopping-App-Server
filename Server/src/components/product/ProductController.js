const productService = require('./ProductService')
const addProduct = async (
    name, price, quantity
) => {
    try {
        return await productService.addProduct(
            name, price, quantity
        );
    } catch (err) {
        console.log('addProduct error(Controller): ' + err);;
    }
};
module.exports = {addProduct}