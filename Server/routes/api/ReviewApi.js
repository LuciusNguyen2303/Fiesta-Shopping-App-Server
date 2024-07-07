const express = require('express')
const router = express.Router();
const reviewController = require('../../src/components/reviews/reviewController')
const {uploadFile} = require("../../src/middleware/UploadFile")

// http://localhost:3000/api/reviews/addReview
router.post("/addReview", async (req, res, next) => {
    try {
        const { userId, productId, reviews, images, rating } = req.body;
        const result = await reviewController.addReviews(userId, productId, reviews, images, rating)
        if (result)
            return res.status(200).json({ result: true, statusCode: 200, message: "Add new Review Succesfully" })
        return res.status(400).json({ result: false, statusCode: 400, message: " Error when add new Review Succesfully" })
    } catch (error) {
        return res.status(500).json({ result: false, statusCode: 500, message: "ERROR ADD REVIEW at API" + error })
    }

})

router.post("/deleteReview/:id/:userId", async (req, res, next) => {
    try {
        const { id, userId } = req.params;
        const result = await reviewController.deleteReviews(id, userId)
        if (result)
            return res.status(200).json({ result: true, statusCode: 200, message: "Add new Review Succesfully" })
        return res.status(400).json({ result: false, statusCode: 400, message: " Error when delete the review." })
    } catch (error) {
        return res.status(500).json({ result: false, statusCode: 500, message: "ERROR ADD REVIEW at API" + error })
    }

})



router.get("/getReviewByPage", async (req, res, next) => {
    // try {
        const { productId, page, size } = req.query;
        const { filterStar, sort } = req.body;
        console.log(productId, page, size,filterStar, sort);
        const result = await reviewController.getReviewsByPage(productId, page, size, filterStar, sort)
        console.log(result);
        if (result!==null && typeof result == 'object'){
            const jsonResponse = JSON.parse(JSON.stringify(result));
            return res.status(200).json({ result: true,data:jsonResponse ,statusCode: 200, message: "Get new Review Succesfully" })

        }
        return res.status(400).json({ result: false, statusCode: 400, message: " Error when get Review Succesfully" })
    // } catch (error) {
    //     return res.status(500).json({ result: false, statusCode: 500, message: "ERROR get REVIEW at API: " + error })
    // }

})
module.exports = router;