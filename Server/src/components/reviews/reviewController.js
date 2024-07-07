const CustomError = require('../../HandleError');
const { deleteImages } = require('../public method/ImageMethod/ImageMethods');
const LIMIT = require('../public method/constant');
const { totalPages, skip } = require('../public method/page');
const reviewService = require('./reviewService')


const addReviews = async (userId, productId, reviews, images, rating) => {
    try {
        if (!userId || !productId)
            throw new CustomError("no userId or productId !!!!")
        if (!rating || (rating > 5 || rating < 0))
            throw new CustomError("Must rate the products ")
        return await reviewService.addReviews(userId, productId, reviews, images, rating)
    } catch (error) {
        console.log("ERROR AT ADD REVIEWS (CONTROLLER): " + error);
        return false
    }
}
const deleteReviews = async (id, userId) => {
    try {
        if (!id || !userId)
            throw new CustomError("no id review or userId !!!!")
        return await reviewService.deleteReviews(id, userId)

    } catch (error) {
        console.log("ERROR AT deleteReviews (CONTROLLER): " + error);
        return false
    }
}

const getReviewsByPage = async (productId, page, size, filterStar, sort) => {
    try {

        if (!productId)
            throw new CustomError("no productId review !!!!")
        if (!page)
            throw new CustomError("no page review !!!!")

        const pageR = skip(size ? size : LIMIT, page)
        if (pageR == null)
            throw new CustomError("page review is not valid  !!!!")

        return await reviewService.getReviewsByPage(productId, pageR, size, filterStar, sort);

    } catch (error) {
        console.log("ERROR AT getReviewsByPage  (CONTROLLER): " + error);
        return false
    }
}

module.exports = { addReviews, deleteReviews, getReviewsByPage }