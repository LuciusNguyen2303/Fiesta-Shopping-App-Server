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
const getAllProduct = async () => {
    try {
        return await productModel.find({});
    } catch (error) {
        console.log('getAllProduct Error(Service): ' + error);
    }
}
const updateProduct = async (productID, updateFileds) => {
    try {
        const productUpdated = await productModel.findByIdAndUpdate(productID, updateFileds, { new: true })
        return !productUpdated ?
            console.log('Product not found') : productUpdated
    } catch (error) {
        console.log('updateProduct Error(Service): ' + error)
    }
}
const getProductByID = async (productID) => {
    try {
        const product = await productModel.findById(productID)
        return !product ?
            console.log('product not found') : product
    } catch (error) {
        console.log('getProductByID Error(Service): ' + error)
    }
}
const searchProducts = async (searchFields) => {
    try {
        const searchBody = {}
        if (searchFields.name) {
            const regex = new RegExp(searchFields.name, 'i');
            searchBody.name = { $regex: regex };
        }
        if (searchFields.priceRange) {
            searchBody.price = { $gte: searchFields.priceRange.min, $lte: searchFields.priceRange.max };
        }
        const products = await productModel.find(searchBody)
        if (!products || products.length === 0) {
            console.log('No products found');
            return null;
        }
        return products;
    } catch (error) {
        console.log('searchProducts Error(Service): ' + error)
    }
}
module.exports = { addProduct, getAllProduct, updateProduct, getProductByID, searchProducts }

