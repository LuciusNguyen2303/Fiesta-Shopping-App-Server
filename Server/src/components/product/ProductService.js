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
const getAllProduct = async() => {
    try {
        return await productModel.find({});
    } catch (error) {
        console.log('getAllProduct Error(Service): ' + error);
    }
}
module.exports = {addProduct, getAllProduct}

