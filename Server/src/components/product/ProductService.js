
const CustomError = require('../../HandleError');
const LIMIT = require('../public method/constant');
const { totalPages } = require('../public method/page');
const productModel = require('./ProductModel')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId

const addProduct = async (
    category, name, image, price, stock, brand, rating, Description, variations) => {
    try {
        const newProduct = {
            category, name, image, price, stock, brand, rating, Description, variations
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

const getProductsByPage = async (page) => {
    try {


        let totalDocument = 0;
        const filter = {

        }
        const result = await productModel.find({ isHidden: false }).limit(LIMIT).skip(page);
        if (page == 0)
            totalDocument = await productModel.find({ isHidden: false }).countDocuments();



        return { result: result, pages: page == 0 && totalDocument > 0 ? totalPages(totalDocument, LIMIT) : null }
    } catch (error) {
        console.log('getAllProduct Error(Service): ' + error);
    }
}

const getProductsByPageByCategories = async (page) => {
    try {
        return await productModel.find({});
    } catch (error) {
        console.log('getAllProduct Error(Service): ' + error);
    }
}

function generateUpdateQueryVariations(updateFields) {
    let queryUpdate = {
        $set: {

        }
    }
    let arrayFilter = [
    ]
    try {
        updateFields.variations.forEach((item, index) => {
            let variationsKeys = Object.keys(item);
            if (variationsKeys.length > 1) {
                const _id = item._id;
                let keyArr = `elements${index}`;

                variationsKeys.forEach((itemVariations, index) => {
                    if (itemVariations !== "_id" && itemVariations) {
                        let key = `variations.$[${keyArr}].${itemVariations}`

                        if (itemVariations == "dimension") {
                            Object.keys(item.dimension).forEach((itemDimensions, index) => {
                                queryUpdate = {
                                    ...queryUpdate,
                                    $set: {
                                        ...queryUpdate.$set,
                                        [key + `.${itemDimensions}`]: item[itemVariations][itemDimensions]
                                    }
                                }

                            })
                            return
                        }
                        queryUpdate = {
                            ...queryUpdate,
                            $set: {
                                ...queryUpdate.$set,
                                [key]: item[itemVariations]
                            }
                        };
                    }

                })
                arrayFilter.push({ [keyArr + "._id"]: _id })
            }
        })
    } catch (error) {
        console.log("ERROR generateQueryVariations: " + error);
    }

    console.log(JSON.stringify(queryUpdate), JSON.stringify(arrayFilter));

    return { query: queryUpdate, filter: arrayFilter }

}

function generateDeleteQueryVariations(updateFields) {
    let queryUpdate = {

    }
    let arrayFilter = [

    ]
    try {
        updateFields.variations.forEach((item, index) => {
            let variationsKeys = Object.keys(item);
            const _id = item._id;
            let keyArr = `elements${index}`;
            let keyItem = `variations.$[${keyArr}]`
            variationsKeys.forEach((itemVariations, index) => {
                if (itemVariations !== "_id" && itemVariations) {
                    let key = `variations.$[${keyArr}].${itemVariations}`

                    if (itemVariations == "dimension") {
                        Object.keys(item.dimension).forEach((itemDimensions, index) => {
                            queryUpdate = {
                                ...queryUpdate,
                                $unset: {
                                    ...queryUpdate.$unset,
                                    [key + `.${itemDimensions}`]: item[itemVariations][itemDimensions]
                                }
                            }

                        })
                        return
                    }
                    queryUpdate = {
                        ...queryUpdate,
                        $unset: {
                            ...queryUpdate.$unset,
                            [key]: item[itemVariations]
                        }
                    };
                    console.log("asdfasfd");

                    return
                }


            })
            if (Object.keys(item).length == 1 && Object.keys(item).includes("_id"))
                queryUpdate = {
                    ...queryUpdate,
                    $pull: {
                        variations: { _id: _id }
                    }
                };

            arrayFilter.push({ [keyArr + "._id"]: _id })

        })
    } catch (error) {
        console.log("ERROR generateQueryVariations: " + error);
    }

    console.log(JSON.stringify(queryUpdate), JSON.stringify(arrayFilter), JSON.stringify(updateFields));

    return { query: queryUpdate, filter: arrayFilter }

}

function generateUpdateQuantityQuery(item) {
    let queryUpdate = {};
    let arrayFilter = [];

    try {
        let variationsKeys = Object.keys(item._doc || item);
        if (variationsKeys.length > 3) {
            // let keyArr = `e`;
            if (variationsKeys.includes("quantity")) {
                let key = `stock`;

                if (item["variationId"] !== null) {
                    key = "variations.$[e].stock";
                    _id = item.variationId;
                    arrayFilter.push({ "e._id": _id });
                }
                queryUpdate = {
                    $inc: {
                        [key]: -item["quantity"],
                        sold: item["quantity"]
                    }
                };
            }
        }

    } catch (error) {
        console.log("ERROR generateQueryVariations: " + error);
    }

    console.log(JSON.stringify(queryUpdate), JSON.stringify(arrayFilter));

    return { query: queryUpdate, filter: arrayFilter };
}

const deleteAttributesInProduct = async (productID, updateFields) => {
    try {
        const checkNecessaryAttribute = await productModel.findOne({
            _id: productID,
            price: { $exists: true },
            stock: { $exists: true },
            image: { $exists: true },
        })
        if (!checkNecessaryAttribute)
            throw new CustomError("No required attributes to delete !! \n You must fill in the product's detail before delete ")
        const deleteData = generateDeleteQueryVariations(updateFields)
        const productUpdated = await productModel.updateOne({ _id: productID }, deleteData.query, { arrayFilters: deleteData.filter, new: true })
        return productUpdated;
    } catch (error) {
        console.log("ERROR deleteAttributesInProduct (SERVICE): " + error);
        return false
    }
}

const updateQuantityAndSoldInQuery = async (updateFields) => {
    try {
        let productUpdated = false;

        let bulkOps = null;
        if (updateFields.length > 0) {
            bulkOps = updateFields.map((item, index) => {
                const query = generateUpdateQuantityQuery(item);
                return {
                    updateOne: {
                        filter: { _id: item.productId },
                        update: query.query,
                        upsert: true,
                        arrayFilters: query.filter
                    }
                };
            });
        }

        console.log(JSON.stringify(bulkOps));

        productUpdated = await productModel.bulkWrite(bulkOps);
        return !productUpdated ? console.log('Product not found') : productUpdated;
    } catch (error) {
        console.log('updateProduct Error(Service): ' + error);
        return false;
    }
};

const deleteProduct = async (productIDs) => {
    try {
        const result = productModel.updateMany(
            {
                _id: {
                    $in: productIDs
                }
            }
            , { hidden: 1 }, { new: true });
        if (!result)
            throw new CustomError("Couldn't delete product. (Service)")
        return result
    } catch (error) {
        console.log("Delete product error (Service): " + error);
        return false;
    }
}

const updateProduct = async (productID, updateFileds) => {
    try {
        let productUpdated = false;
        if (Object.keys(updateFileds).includes("variations")) {
            const updateData = generateUpdateQueryVariations(updateFileds)
            if (updateData)
                productUpdated = productModel.findByIdAndUpdate(productID, updateData.query, { arrayFilters: updateData.filter })

        } else
            productUpdated = await productModel.findByIdAndUpdate(productID, updateFileds, { new: true })

        return !productUpdated ?
            console.log('Product not found') : productUpdated
    } catch (error) {
        console.log('updateProduct Error(Service): ' + error)
        return { result: false, data: null, page: null }
    }
    /* 
     
      */
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

const searchProducts = async (req) => {
    try {
        const searchFields = req.query
        const searchBody = {}
        if (searchFields) {
            if (searchFields && searchFields.name) {
                const regex = new RegExp(searchFields.name, 'i');
                searchBody.name = { $regex: regex };
            }
            

            if (searchFields && searchFields.priceRange && searchFields.priceRange.min && searchFields.priceRange.max) {
                searchBody.price = { $gte: searchFields.priceRange.min, $lte: searchFields.priceRange.max };
            }
            if (searchFields && searchFields.category) {
                const categoryConditions = [];
                if (Array.isArray(searchFields.category.mainCategory) && searchFields.category.mainCategory.length > 0) {
                    categoryConditions.push({ 'category.mainCategory': { $in: searchFields.category.mainCategory } });
                }
                if (Array.isArray(searchFields.category.subCategory) && searchFields.category.subCategory.length > 0) {
                    categoryConditions.push({ 'category.subCategory': { $in: searchFields.category.subCategory } });
                }

                if (categoryConditions.length > 0) {
                    searchBody.$or = categoryConditions;
                }
            }
        }
        const sortBy = searchFields && searchFields.sortBy || 'createAt';
        const sortOrder = searchFields && searchFields.sortOrder === 'desc' ? -1 : 1;
        const limit = searchFields && searchFields.limit || 0;
        const page = searchFields && searchFields.page || 0;
        let skip = 0;
        if (page > 0 && limit > 0) {
            skip = (page - 1) * limit;
        }
        const countDocument = await productModel.find(searchBody).countDocuments();
        console.log(searchBody);
        const products = await productModel.find(searchBody).sort({ [sortBy]: sortOrder }).skip(skip).limit(limit)
        if (!products || products.length === 0) {
            console.log('No products found');
            return null;
        }
        return { products, countDocument };
    } catch (error) {
        console.log('searchProducts Error(Service): ' + error)
    }
}

const checkProductVariationStock = async (id, size, color) => {
    try {
        const product = await productModel.findById(id, 'variations');
        if (product && product.variations && product.variations.length > 0) {
            const variation = product.variations.find(item => item.dimension.size === size && item.dimension.color === color);
            if (variation) {
                return variation.stock;
            }
        }
        return null;
    } catch (error) {
        console.log('Error while checking product variation stock: ', error);
        return null;
    }
}
module.exports = { 
    updateQuantityAndSoldInQuery, 
    deleteProduct, addProduct, 
    deleteAttributesInProduct, 
    getProductsByPageByCategories, 
    getAllProduct, getProductsByPage, 
    updateProduct, getProductByID, 
    searchProducts, checkProductVariationStock }

