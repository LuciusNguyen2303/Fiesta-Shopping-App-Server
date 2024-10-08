const express = require('express')
const router = express.Router();
const cartController = require("../../src/components/cart/cartController");
const { DivideVariationsFromCarts, calculatePrice, validateCarts } = require('./PaymentMethod/CalculatePriceFromServer');
const productController = require('../../src/components/product/ProductController');
const CustomError = require('../../src/HandleError');
const { authenticateToken } = require('../../src/middleware/jwtValidation');
const { AuthorizedForCustomer } = require('../../src/middleware/Authorized');
// http://localhost:3000/api/cart/
router.post("/add",[authenticateToken,AuthorizedForCustomer], async (req, res, next) => {
    try {
        const { addFields } = req.body;

        const request = await cartController.addCarts(addFields)

        return request ?
            res.status(200).json({ result: true, statusCode: 200, message: 'add succesfully', data: request }) :
            res.status(400).json({ result: false, statusCode: 400, message: 'add failed' })
    } catch (error) {
        return res.status(500).json({ result: false, statusCode: 500, message: 'add Error(Api): ' + error })

    }
})
router.post("/update",[authenticateToken,AuthorizedForCustomer], async (req, res, nex) => {
    try {
        const { updateFields } = req.body;
        const { cartID } = req.query;
        const request = await cartController.updateCart(cartID, updateFields)
        console.log(request);
        return request ?
            res.status(200).json({ result: true, statusCode: 200, message: 'update succesfully' }) :
            res.status(400).json({ result: false, statusCode: 400, message: 'update failed' })
    } catch (error) {
        return res.status(500).json({ result: false, statusCode: 500, message: 'update Error(Api): ' + error })

    }
})
router.post("/delete",[authenticateToken,AuthorizedForCustomer], async (req, res, nex) => {
    try {
        const { cartID } = req.query;
        const request = await cartController.deleteCart(cartID)

        return request ?
            res.status(200).json({ result: true, statusCode: 200, message: 'delete succesfully' }) :
            res.status(400).json({ result: false, statusCode: 400, message: 'delete failed' })
    } catch (error) {
        return res.status(500).json({ result: false, statusCode: 500, message: 'delete Error(Api): ' + error })

    }
})
router.post("/deleteCarts",[authenticateToken,AuthorizedForCustomer], async (req, res, nex) => {
    try {
        const { cartIDs } = req.body;
        const request = await cartController.deleteManyCarts(cartIDs)

        return request ?
            res.status(200).json({ result: true, statusCode: 200, message: 'delete succesfully' }) :
            res.status(400).json({ result: false, statusCode: 400, message: 'delete failed' })
    } catch (error) {
        return res.status(500).json({ result: false, statusCode: 500, message: 'delete Error(Api): ' + error })

    }
})
router.post('/total',[authenticateToken,AuthorizedForCustomer], async (req, res, next) => {
    try {
        const data = req.body;
        // check if not valid data ?
        console.log(data);
        if (!data.products)
            throw new CustomError("Error with cart's data.")
        // Convert data to variationid array and productid array for search by aggerate
        const convertedData = DivideVariationsFromCarts(data)
        const priceData = await productController.findPriceInProducts(convertedData);
        const amount = calculatePrice(priceData, data.products)

        if (amount < 0)
            throw new CustomError("Error when calculate!!!")
        console.log(amount);
        return res.status(200).json({ userId: data.userId, message: "SUCCESSFUL", total: amount, statusCode: 200 })
    } catch (error) {
        console.log("PAYMENT METHODS API: ", error);
        return res.status(500).json({ message: error, statusCode: 500 })
    }
});
router.get("/getByPage/:page/:userId",[authenticateToken,AuthorizedForCustomer], async (req, res, nex) => {
    try {
        const { page, userId } = req.params;
        console.log(page, userId);
        const request = await cartController.getCartsByPage(userId, page)
        return request ?
            res.status(200).json({ result: true, statusCode: 200, message: 'getByPage succesfully',data:request }) :
            res.status(400).json({result: false, statusCode: 400, message: 'getByPage failed' })

    } catch (error) {
        return res.status(500).json({ result: false, statusCode: 500, message: 'getByPage Error(Api): ' + error })

    }
})
router.get("/getCartByIds",[authenticateToken,AuthorizedForCustomer], async (req, res, next) => {
    try {
        const { getFields, userId } = req.query;
        
        const result = await cartController.getCartByIds(getFields, userId)
        return result ?
            res.status(200).json({ result: true, statusCode: 200, message: 'get cart by ids succesfully', data: result.result, documents: result.documents}) :
            res.status(400).json({ result: false, statusCode: 400, message: 'get cart by ids failed' })
    } catch (error) {
        return res.status(500).json({ result: false, statusCode: 500, message: 'get cart by ids Error(Api): ' + error })
    }
})
module.exports = router