
const CustomError = require('../../HandleError');
const { uploadMultipleImages, uploadImage, deleteImages } = require('../public method/ImageMethod/ImageMethods');
const LIMIT = require('../public method/constant');
const { totalPages } = require('../public method/page');
const productModel = require('./ProductModel')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId
const getStockProduct = async (productId, variationId) => {
    try {
        console.log(productId, variationId);
        const result = await productModel.aggregate([
            {
                $match: {
                    _id: new ObjectId(productId)
                }
            },
            {
                $unwind: "$variations"
            },
            {
                $match: {
                    "variations._id": new ObjectId(variationId)
                }
            },
            {
                $project: {
                    productId: "$_id",
                    variationId: "$variations._id",
                    stock: "$variations.stock"
                }
            }
        ])
        return result
    } catch (error) {
        console.log("Get stock product error: ", error);
    }
}
const getStockManyProducts = async (items) => {
    try {
        // Tạo điều kiện lọc cho tất cả sản phẩm và biến thể
        const matchConditions = items.map(item => ({
            $and: [
                { _id: new ObjectId(item.productId) },
                { "variations._id": new ObjectId(item.variationId) }
            ]
        }));

        // Chạy truy vấn để lấy kết quả cho tất cả sản phẩm và biến thể
        const result = await productModel.aggregate([
            {
                $match: {
                    $or: matchConditions
                }
            },
            {
                $unwind: "$variations"
            },
            {
                $match: {
                    $or: items.map(item => ({
                        "variations._id": new ObjectId(item.variationId)
                    }))
                }
            },
            {
                $project: {
                    productId: "$_id",
                    variationId: "$variations._id",
                    stock: "$variations.stock"
                }
            }
        ]);

        // Kiểm tra tồn kho cho từng sản phẩm và biến thể
        const stockCheckResult = items.map(item => {
            const foundItem = result.find(r => r.productId.equals(new ObjectId(item.productId)) && r.variationId.equals(new ObjectId(item.variationId)));
            const isStockSufficient = foundItem && foundItem.stock >= item.quantity;
            return {
                productId: item.productId,
                variationId: item.variationId,
                requiredQuantity: item.quantity,
                stockAvailable: foundItem ? foundItem.stock : 0,
                isStockSufficient: isStockSufficient ? true : false
            };
        });

        return stockCheckResult;
    } catch (error) {
        console.log("Get stock products error: ", error);
        throw error;
    }
};

// Example usage





const addProduct = async (addFields) => {
    try {
        const newP = new productModel(addFields);
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
    let arrayFilter = []

    try {
        // Kiểm tra nếu updateFields có thuộc tính variation
        if (!updateFields.variation) {
            throw new Error("Invalid input: updateFields.variations should be a non-empty object");
        }
        

        const variation = updateFields.variation
        const keys = Object.keys(variation)

        const _id = updateFields.variation._id;
        let keyArr = `elements`;
        for (const index in keys) {
            const itemVariation=keys[index]
            let key = `variations.$[${keyArr}].${itemVariation}`;

            if (itemVariation == "dimension") {
                for (let itemDimensions of Object.keys(variation.dimension)) {
                    queryUpdate = {
                        ...queryUpdate,
                        $set: {
                            ...queryUpdate.$set,
                            [key + `.${itemDimensions}`]: variation[itemVariation][itemDimensions]
                        }
                    };
                }

            }

            if (itemVariation == "subImage") {
                
                queryUpdate = {
                    ...queryUpdate,
                    $set: {
                        ...queryUpdate.$set,
                        [key]: variation["subImage"]
                    }
                };

            }
            
            if(itemVariation!=="dimension"&&itemVariation!=="image"){
                queryUpdate = {
                    ...queryUpdate,
                    $set: {
                        ...queryUpdate.$set,
                        [key]: variation[itemVariation]
                    }
                };
            }
           

        }


        arrayFilter.push({ [`${keyArr}._id`]: _id });


    } catch (error) {
        console.log("ERROR generateQueryVariations: " + error);
        return null;
    }

    console.log(queryUpdate, JSON.stringify(arrayFilter));

    return { query: queryUpdate, filter: arrayFilter };
}
function generateAddQueryVariations(addFields) {

    try {
        const variationId = new mongoose.Types.ObjectId()
        const queryUpdate = {
            $push: {
                // _id:new mongoose.Types.ObjectId() ,
                variations: addFields
            }
        }
        return { queryUpdate: queryUpdate, _id: variationId }
    } catch (error) {
        console.log("ERROR generateQueryVariations: " + error);
        return {}
    }




}
const generateDeleteQueryVariations = (updateFields) => {

    try {

        const _id = updateFields.variation._id;
        let queryUpdate = {
            $pull: {
                variations: { _id: new mongoose.Types.ObjectId(_id) }
            }
        }

        return queryUpdate

    } catch (error) {
        console.log("ERROR generateQueryVariations: " + error);
        return {}
    }



}

function generateMinusQuantityQuery(item) {
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
                        sold: +item["quantity"],
                        stock: -item["quantity"],
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
function generateReturnQuantityQuery(item) {
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
                        [key]: +item["quantity"],
                        stock: +item["quantity"],
                        sold: -item["quantity"]
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


const updateMinusQuantityAndSoldInQuery = async (updateFields) => {
    try {
        let productUpdated = false;

        let bulkOps = null;
        if (updateFields.length > 0) {
            bulkOps = updateFields.map((item, index) => {
                const query = generateMinusQuantityQuery(item);
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
const updatePlusQuantityAndSoldInQuery = async (updateFields) => {
    try {
        let productUpdated = false;

        let bulkOps = null;
        if (updateFields.length > 0) {
            bulkOps = updateFields.map((item, index) => {
                const query = generateReturnQuantityQuery(item);
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
            , { hidden: true }, { new: true });
        if (!result)
            throw new CustomError("Couldn't delete product. (Service)")
        return result
    } catch (error) {
        console.log("Delete product error (Service): " + error);
        return false;
    }
}
const deleteVariation = async (productID, updateFields) => {
    try {
        const checkNecessaryAttribute = await productModel.findOne({
            _id: productID,
            price: { $exists: true },
            stock: { $exists: true },
            images: { $exists: true },
        })

        if (!checkNecessaryAttribute)
            throw new CustomError("No required attributes to delete !! \n You must fill in the product's detail before delete ")
        const deleteQuery = generateDeleteQueryVariations(updateFields)
        const productUpdated = await productModel.findByIdAndUpdate({ _id: productID }, deleteQuery, { new: true })
        const imageId = updateFields.variation.subImage?.id
     ;
        
        if (imageId)
            await deleteImages([imageId])
        return productUpdated;
    } catch (error) {
        console.log("ERROR deleteAttributesInProduct (SERVICE): " + error);
        return false
    }
}
const updateVariation = async (productId, updateFields) => {
    try {
        const updatedVariationQuery = generateUpdateQuery(updateFields)
        const updateQuery = productModel.findByIdAndUpdate(productId, updatedVariationQuery.query, { arrayFilters: updatedVariationQuery.filter })
        return updateQuery
    } catch (error) {

    }
}
const addNewVariation = async (productId, addFields) => {
    try {
        console.log("addNewVariation   ", productId);

        const newVariationQuery = generateAddQueryVariations(addFields)
        const updateQuery = await productModel.findOneAndUpdate({ _id: productId }, newVariationQuery.queryUpdate, { new: true })

        return { updateQuery, _id: newVariationQuery._id }
    } catch (error) {
        console.log("addNewVariation", error);
        return false

    }
}
const updateProduct = async (productID, updateFileds) => {
    try {
        let productUpdated = false;

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

                if (subCategories.length > 0 && subCategories[0].length > 0) {
                    categoryConditions.push({ 'category.subCategory': { $in: subCategories } });
                }
            }

            if (categoryConditions.length > 0) {
                searchBody.$and = categoryConditions;
            }
        }
        console.log('searchBody: ' + JSON.stringify(searchBody))

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
const getProductListByStandard = async (type) => {
    try {
        let item = null;
        if (!type == "createAt" || !type == "rating" || !type == "sold")
            throw new CustomError("Missing stock or rating or sold fields!!!")
        item = { [type]: -1 }
        const result = await productModel.find().sort(item).limit(15)
        return result ? result : null;
    } catch (error) {
        console.log('searchProducts Error(Service): ' + error)
    }
}
module.exports = { getStockManyProducts, getStockProduct, getProductListByStandard, checkProductVariationStock, findPriceInProducts, updateMinusQuantityAndSoldInQuery, updatePlusQuantityAndSoldInQuery, deleteProduct, addProduct, deleteVariation, addNewVariation, updateVariation, getProductsByPageByCategories, getAllProduct, getProductsByPage, updateProduct, getProductByID, searchProducts }


