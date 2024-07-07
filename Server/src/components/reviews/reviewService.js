const CustomError = require('../../HandleError');
const { deleteImages, uploadMultipleImages } = require('../public method/ImageMethod/ImageMethods');
const LIMIT = require('../public method/constant');
const { totalPages } = require('../public method/page');
const reviewModel = require('./reviewModel')


const addReviews = async (userId, productId, reviews, image, rating) => {
    try {
        let images = []
        if (Array.isArray(image) && image.length > 0)
            images = await uploadMultipleImages(image, "Reviews")

        const review = { userId, productId, reviews, images, rating }
        const newP = new reviewModel(review)
        return await newP.save();
    } catch (error) {
        console.log("ERROR AT ADD REVIEWS (SERVICE): " + error);
        return false
    }
}
const deleteReviews = async (id, userId) => {
    try {
        const check = await reviewModel.findOne({ _id: id, userId: userId }).select("images")
        if (!check)
            return false
        console.log(JSON.stringify(check));
        if (check.images.length > 0) {
            const deletePromises = await check.images.map(async (item) => {
                const isDeleted = await deleteImages([item.id])
                return isDeleted;
            })
            const result = await Promise.all(deletePromises)
            if (!result)
                throw new CustomError("Can't delete review's image.")
        }
        return await reviewModel.findOneAndDelete({ _id: id })

    } catch (error) {
        console.log("ERROR AT DELETE REVIEWS (SERVICE): " + error);
        return false
    }
}

const getReviewsByPage = async (productId, page, size, filterStar, sort) => {
    try {

        let query = { productId: productId }
        let sorts = {}
        if (!isNaN(filterStar))
            query = {
                ...query,
                rating: rating
            }
        if (typeof sort === 'object' && sort !== null) {
            if (sort.type == 'ASC')
                sorts = {
                    ...sorts,
                    [sort.field]: 1
                }
            else if (sort.type == 'DESC')
                sorts = {
                    ...sorts,
                    [sort.field]: -1
                }
        }
        const result = await reviewModel.find(query).skip(page).limit(size)
        const totalDocument =await reviewModel.find(query).countDocuments();
        if (result)
            return { result: true, data: result, total: totalDocument, totalPage: totalPages(totalDocument, size?size:LIMIT),page:page };
        return null
    } catch (error) {
        console.log("ERROR AT GET REVIEWS (SERVICE): " + error);
        return null
    }
}

module.exports = { addReviews, deleteReviews, getReviewsByPage }