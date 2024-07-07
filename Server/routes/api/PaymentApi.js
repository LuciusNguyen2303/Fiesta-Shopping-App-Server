const express = require('express');
const { DivideVariationsFromCarts, calculatePrice, validateCarts } = require('./PaymentMethod/CalculatePriceFromServer');
const router = express.Router();
const productController = require('../../src/components/product/ProductController');
const CustomError = require('../../src/HandleError');
const { stripe } = require('../api/PaymentMethod/Stripe')
// http://localhost:3000/api/payment/

router.post('/intent', async (req, res, next) => {
    try {
        const data = req.body;
        console.log(data);
        // check if not valid data ?
        if (!validateCarts(data))
            throw new CustomError("Error with cart's data.")
        // Convert data to variationid array and productid array for search by aggerate
        const convertedData = DivideVariationsFromCarts(data)
        const priceData = await productController.findPriceInProducts(convertedData);
        const amount = calculatePrice(priceData, data.products)
        if (amount < 0)
            throw new CustomError("Error when calculate!!!")
        const result = await stripe.paymentIntents.create({
            currency: 'usd',
            amount: Math.round(amount) * 100,
            automatic_payment_methods: {
                enabled: true
            }
        })
        console.log(result);
        return res.status(200).json({ data: result.client_secret, userId: data.userId, message: "SUCCESSFUL", statusCode: 200 })
    } catch (error) {
        console.log("PAYMENT METHODS API: ", error);
        return res.status(500).json({ message: error, statusCode: 500 })
    }
});
router.post('/test', async (req, res, next) => {
    try {
        const data = req.body;
        if (!validateCarts(data))
            throw new CustomError("Error with cart's data.")
        const convertedData = DivideVariationsFromCarts(data)
        const priceData = await productController.findPriceInProducts(convertedData);
        const result = calculatePrice(priceData, data.products)
        return res.status(200).json({ data: result, message: "SUCCESSFUL", statusCode: 200 })
    } catch (error) {
        console.log("PAYMENT METHODS API: ", error);
        return res.status(500).json({ message: error, statusCode: 500 })
    }
});
router.post('/cancelPaymentIntents/:paymentId/:userId', async (req, res, next) => {
    try {
        const { paymentId, userId } = req.params;

        if (!paymentId || !userId) {
            return res.status(400).json({ message: "Invalid paymentId or userId", statusCode: 400 });
        }

        let refund = null;

        if (paymentId) {
            try {
                paymentIntent  = await stripe.paymentIntents.cancel(paymentId);
            } catch (stripeError) {
                console.log("Stripe error: ", stripeError);
                return res.status(400).json({ message: "Failed to cancel the payment", error: stripeError.message, statusCode: 400 });
            }
        }

        // Trả về kết quả thành công hoặc lỗi
        return paymentIntent  ? 
            res.status(200).json({ data: refund, userId: userId, message: "SUCCESSFUL", statusCode: 200 }) :
            res.status(400).json({ message: "No refund processed", statusCode: 400 });

    } catch (error) {
        console.log("PAYMENT METHODS API: ", error);
        return res.status(500).json({ message: "Internal server error", error: error.message, statusCode: 500 });
    }
});



/* 
    json = {
        userId:"",
        products:[
            {
                productId:"",
                variationId:""
                quantity:0
            }
        ]
    
    }

*/


module.exports = router