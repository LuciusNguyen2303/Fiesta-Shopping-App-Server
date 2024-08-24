const express = require("express")
const route = express.Router();
const orderController = require("../../src/components/order/orderController")
const { stripe } = require('../api/PaymentMethod/Stripe')

// http://localhost:3000/api/order

route.post("/createOrder", async (req, res, next) => {
    try {

        const { userId, payments, shipping, products } = req.body;
        console.log(userId, payments, shipping, products);

        const result = await orderController.createOrder(userId, payments, shipping, products);

        return result ?
            res.status(200).json({ result: true, message: "Create the order successfully.", statusCode: 200,data:result })
            :
            res.status(500).json({ result: false, message: "Something went wrong when create the order in db.", statusCode: 500 })

    } catch (error) {
        console.log("Error at createOrder(api): " + error);
        return res.status(500).json({ result: null, statusCode: 500, error: error })
    }

})
route.post("/updateStatusOrder", async (req, res, next) => {
    try {

        const { status } = req.body;
        const { id } = req.query;
        const result = await orderController.updateOrder(id, status);

        if (result && status == "Returned")
            if (payments.method == "Google Pay" || payments.method == "Visa")
                await stripe.refunds.create({
                    payment_intent: payments.TransactionId
                })
        console.log(result);
        return result ?
            res.status(200).json({ result: true, message: "Update the status's order successfully.", statusCode: 200 })
            :
            res.status(200).json({ result: false, message: "Something went wrong when create the order in db.", statusCode: 500 })

    } catch (error) {
        console.log("Error at createOrder(api): " + error);
        return res.status(500).json({ result: null, statusCode: 500, error: error })
    }

})
route.get("/getOrder", async (req, res, next) => {
    try {

        const { page, userId } = req.query;

        const result = await orderController.getOrder(page);
        return Object.keys.length > 0 ?
            res.status(200).json({
                result: true,
                data: result.data,
                totalPages: result.pages,
                message: "Get the orders successfully.",
                statusCode: 200
            })
            :
            res.status(500).json({ result: false, data: null, message: "Something went wrong when get the orders in db.", statusCode: 500 })

    } catch (error) {
        console.log("Error at getOrder(api): " + error);
        return res.status(500).json({ result: null, statusCode: 500, error: error })
    }

})
route.get("/getOrderByUser", async (req, res, next) => {
    try {



        const { page, userId } = req.query;
        const result = await orderController.getOrderByUser(userId, page);

        return Object.keys(result).length > 0 ?
            res.status(200).json({ result: true, data: result.data, pages: result.pages, message: "get the orders by user successfully.", statusCode: 200 })
            :
            res.status(500).json({ result: false, message: "Something went wrong when get the orders by user in db.", statusCode: 500 })

    } catch (error) {
        console.log("Error at createOrder(api): " + error);
        return res.status(500).json({ result: null, statusCode: 500, error: error })
    }

})
route.get("/getOrderById", async (req, res, next) => {
    try {

        const { orderId } = req.query;
        const result = await orderController.getOrderById(orderId);

        return result && Object.keys(result).length > 0 ?
            res.status(200).json({ result: true, data: result[0], message: "get the orders by user successfully.", statusCode: 200 })
            :
            res.status(500).json({ result: false, message: "Something went wrong when get the orders by user in db.", statusCode: 500 })

    } catch (error) {
        console.log("Error at createOrder(api): " + error);
        return res.status(500).json({ result: null, statusCode: 500, error: error })
    }

})
route.post("/delete/:userId", async (req, res, next) => {
    try {

        const { userId } = req.params;

        const result = await orderController.deleteOrder(userId);

        return result ?
            res.status(200).json({ result: true, message: "Delete the order successfully.", statusCode: 200 })
            :
            res.status(500).json({ result: false, message: "Something went wrong when delete the order in db.", statusCode: 500 })

    } catch (error) {
        console.log("Error at deleteOrder(api): " + error);
        return res.status(500).json({ result: null, statusCode: 500, error: error })
    }

})
route.post("/cancelOrder", async (req, res, next) => {
    try {

        const { order } = req.body;
        const { userId, status, payments } = order
        let result = await orderController.updateOrder(order._id, "Cancelled");
        if (result)
            if (['Pending', 'Processing', 'Shipping'].includes(status))
                if (payments.method == "Google Pay" || payments.method == "Visa")
                    await stripe.refunds.create({
                        payment_intent: payments.TransactionId
                    })








        return result ?
            res.status(200).json({ result: true, message: "Cancel the order successfully.", statusCode: 200 })
            :
            res.status(500).json({ result: false, message: "Something went wrong when cancel the order in db.", statusCode: 500 })

    } catch (error) {
        console.log("Error at deleteOrder(api): " + error);
        return res.status(500).json({ result: null, statusCode: 500, error: error })
    }

})
module.exports = route