const productModel = require('./ProductModel')
const addProduct = async (
    name, price, quantity) => {
    try {
        const newProduct = {
            name, price, quantity
        };
        console.log('addProduct data: ' + JSON.stringify(newProduct));
        const newP = new productModel(newProduct);
        return await newP.save();
    } catch (err) {
        console.log("addProduct Error(Service): " + err);
        return false;
    }
}
module.exports = {addProduct}

