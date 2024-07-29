
const CustomError = require('../../HandleError');
const { uploadMultipleImages, uploadImage, deleteImages } = require('../public method/ImageMethod/ImageMethods');
const LIMIT = require('../public method/constant');
const { totalPages } = require('../public method/page');
const productModel = require('./ProductModel')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId

const addProduct = async (
    category, name, image, price, stock, brand, rating, Description, variations) => {
    try {
        // Send image to host Imagekit 
        const images = await uploadMultipleImages(image, "Products")
        // Send image of variations to host imagekit
        if (variations && Array.isArray(variations)) {
            const variationPromises = variations.map(async (item, index) => {
                if (Object.keys(item).includes("image")) {
                    const imageURL = await uploadImage(item["image"], "Products");
                    item.image = imageURL
                }

                return item;
            })
            variations = await Promise.all(variationPromises);
        }
        const newProduct = {
            category, name, images, price, stock, brand, rating, Description, variations
        };

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

function generateUpdateQuery(updateFields) {
    let queryUpdate = {
        $set: {}
    };
    let arrayFilter = [], deleteImageArr = [], updatedImagesArr = [];

    try {
        // Kiểm tra nếu updateFields có thuộc tính variations và variations là một mảng
        if (!updateFields.variations || !Array.isArray(updateFields.variations)) {
            throw new Error("Invalid input: updateFields.variations should be a non-empty array");
        }
        // Query Update for the images of a products


        // Query Update for the variations of a product

        for (let index = 0; index < updateFields.variations.length; index++) {
            let item = updateFields.variations[index];
            let variationsKeys = Object.keys(item);

            if (variationsKeys.length > 1) {

                const _id = item._id;
                let keyArr = `elements${index}`;

                for (let itemVariations of variationsKeys) {
                    if (itemVariations !== "_id" && itemVariations) {
                        let key = `variations.$[${keyArr}].${itemVariations}`;

                        if (itemVariations == "dimension") {
                            for (let itemDimensions of Object.keys(item.dimension)) {
                                queryUpdate = {
                                    ...queryUpdate,
                                    $set: {
                                        ...queryUpdate.$set,
                                        [key + `.${itemDimensions}`]: item[itemVariations][itemDimensions]
                                    }
                                };
                            }
                            continue;
                        }

                        if (itemVariations == "subImage") {
                            queryUpdate = {
                                ...queryUpdate,
                                $set: {
                                    ...queryUpdate.$set,
                                    [key]: item["subImage"]
                                }
                            };
                            continue;
                        }

                        queryUpdate = {
                            ...queryUpdate,
                            $set: {
                                ...queryUpdate.$set,
                                [key]: item[itemVariations]
                            }
                        };
                    }
                }

                arrayFilter.push({ [`${keyArr}._id`]: _id });
            }
        }
    } catch (error) {
        console.log("ERROR generateQueryVariations: " + error);
        return null;
    }

    console.log(JSON.stringify(queryUpdate), JSON.stringify(arrayFilter));

    return { query: queryUpdate, filter: arrayFilter };
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

        productUpdated = await productModel.findByIdAndUpdate(productID, updateFileds, { new: true })
        console.timeEnd("QUERY UPDATE>>>")
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
        const { name, priceRange, category, sortBy, sortOrder, limit = 0, page = 0 } = req.query;
        let searchBody = {};

        if (name) {
            const regex = new RegExp(name, 'i');
            searchBody.name = { $regex: regex };
        }

        if (priceRange && priceRange.min && priceRange.max) {
            searchBody.price = { $gte: priceRange.min, $lte: priceRange.max };
        }

        if (category) {
            const mainCategories = category.mainCategory || '';
            const subCategories = category.subCategory || [];

            // Tạo điều kiện tìm kiếm
            const categoryConditions = [];

            if (mainCategories) {
                categoryConditions.push({ 'category.mainCategory': mainCategories });
                console.log('categoryConditions: ' + categoryConditions)

                if (subCategories.length > 0) {
                    categoryConditions.push({ 'category.subCategory': { $in: subCategories } });
                }
            }

            if (categoryConditions.length > 0) {
                searchBody.$and = categoryConditions;
            }
        }

        const countDocument = await productModel.find(searchBody).countDocuments();
        const totalPages = Math.ceil(countDocument / limit);
        const effectivePage = page > totalPages ? totalPages : page;
        const skip = effectivePage > 0 ? (effectivePage - 1) * limit : 0;
        const sort = sortBy === "" ? 'createAt' : sortBy
        const order = sortOrder === 'desc' ? -1 : 1

        const products = await productModel.find(searchBody, { variations: 0 })
            .sort({ [sort]: order })
            .skip(skip)
            .limit(limit);

        if (!products || products.length === 0) {
            console.log('No products found');
            return { products: [], countDocument };
        }

        return { products, countDocument };
    } catch (error) {
        console.log('searchProducts Error(Service): ' + error);
    }
}

const checkProductVariationStock = async (req) => {
    try {
        const { id, size, color } = req.query
        const product = await productModel.findById(id, 'variations');
        if (product && product.variations && Array.isArray(product.variations) && product.variations.length > 0) {
            let variation;
            if (size && color) {
                variation = product.variations.find(item => item.dimension.size === size && item.dimension.color === color);
            } else if (size) {
                variation = product.variations.find(item => item.dimension.size === size);
            } else if (color) {
                variation = product.variations.find(item => item.dimension.color === color);
            }
            return variation ? {
                _id: variation._id,
                stock: variation.stock
            } : 0;
        }
        return null;
    } catch (error) {
        console.log('Error while checking product variation stock: ', error);
        return null;
    }
}

const findPriceInProducts = async (data) => {
    try {
        const result = await productModel.aggregate([
            {
                $match: {
                    _id: { $in: data.productIds }
                }
            },
            {
                $unwind: "$variations"
            },
            {
                $match: {
                    "variations._id": { $in: data.variationIds }
                }
            },
            {
                $project: {
                    productId: "$_id",
                    variationId: "$variations._id",
                    price: "$variations.price"
                }
            }
        ]).exec()
        return result ? result : null;
    } catch (error) {
        console.log('searchProducts Error(Service): ' + error)
    }
}
module.exports = { checkProductVariationStock, findPriceInProducts, updateQuantityAndSoldInQuery, deleteProduct, addProduct, deleteAttributesInProduct, getProductsByPageByCategories, getAllProduct, getProductsByPage, updateProduct, getProductByID, searchProducts }


