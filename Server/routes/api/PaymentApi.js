const express = require('express');
const { DivideVariationsFromCarts, calculatePrice, validateCarts } = require('./PaymentMethod/CalculatePriceFromServer');
const router = express.Router();
const productController = require('../../src/components/product/ProductController');
const CustomError = require('../../src/HandleError');
const { stripe } = require('../api/PaymentMethod/Stripe')
const PaymentMethodController = require('../../src/components/PaymentMethod/PaymentMethodController');
const UserController = require('../../src/components/user/UserController');
const { CustomerUpdateFields } = require('../../src/components/public method');
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
        const {customerId, paymentMethodId} = data
        let order  ={
            currency: 'usd',
            amount: Math.round(amount) * 100,
            automatic_payment_methods: {
                enabled: true
            },
           
           
        }
        if(customerId)
            order ={...order,customer:customerId}
        if(paymentMethodId)
            order ={...order,payment_method:paymentMethodId}
        
        if (amount < 0)
            throw new CustomError("Error when calculate!!!")
        const result = await stripe.paymentIntents.create()
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
                paymentIntent = await stripe.paymentIntents.cancel(paymentId);
            } catch (stripeError) {
                console.log("Stripe error: ", stripeError);
                return res.status(400).json({ message: "Failed to cancel the payment", error: stripeError.message, statusCode: 400 });
            }
        }

        // Trả về kết quả thành công hoặc lỗi
        return paymentIntent ?
            res.status(200).json({ data: refund, userId: userId, message: "SUCCESSFUL", statusCode: 200 }) :
            res.status(400).json({ message: "No refund processed", statusCode: 400 });

    } catch (error) {
        console.log("PAYMENT METHODS API: ", error);
        return res.status(500).json({ message: "Internal server error", error: error.message, statusCode: 500 });
    }
});

router.post('/save-card', async (req, res, next) => {
    try {
        const { userId, token, isDefault } = req.query;


        if (!userId || !token)
            throw new CustomError("Empty at least one fields!!! (UserId or token)")


        let result = null
        const availablePaymentMethod = await PaymentMethodController.getDefaultPaymentMethod(userId)
        const user = await UserController.getUserbyId(userId);


        // Check payment method in db

        const newUser = {
            name: user.name,
        }
        if (!availablePaymentMethod) {
            // If not, create customer and attach the card into customer
            // Create default payment method in db 
            if (!user)
                throw new CustomError("No available user!!")

            const customer = await stripe.customers.create(newUser);
            const paymentId = await stripe.customers.createSource(
                customer.id,
                {
                    source: token
                })
            result = await PaymentMethodController.insertPaymentMethod({ userId: userId, defaultCard: paymentId.id, customerId: customer.id })

        } else {
            //Check duplicate card in stripe 
            const card = await stripe.tokens.retrieve(token);
            const last4 = card.card.last4;

            const paymentMethods = await stripe.customers.listSources(availablePaymentMethod.customerId, { object: 'card' });

            const isDuplicate = paymentMethods.data.some(card => card.last4 === last4);
            if (isDuplicate) {
                console.log(isDuplicate);
                return res.status(400).json({ error: 'Card already exists.' });
            }

            // create the card and attach to customer

            const paymentId = await stripe.customers.createSource(
                availablePaymentMethod.customerId,
                {
                    source: token
                })
            if (paymentId)
                result = true

            // save default in db (Optional)
            if (isDefault) {
                const updatedCustomer = await stripe.customers.update(availablePaymentMethod.customerId, {
                    default_source: paymentId.id
                });

                if (updatedCustomer) {
                    const newPaymentMethod = { ...availablePaymentMethod._doc, defaultCard: paymentId.id }

                    result = await PaymentMethodController.updatePaymentMethod(newPaymentMethod)
                }
            }

        }

        return result !== null ?
            res.status(200).json({ result: true, message: "CREATE NEW CARD SUCCESFULLY !!!", statusCode: 200 })
            : res.status(400).json({ result: false, message: "ERROR WHILE CREATE NEW CARD !!!", statusCode: 400 })
    } catch (error) {
        console.log("ERROR SAVE CARD: ", error);
        return res.status(500).json({ message: error, statusCode: 500 })
    }
})
router.post('/choose-default-card', async (req, res, next) => {
    try {

        const { userId, paymentMethodId } = req.query;
        let result = null
        const availablePaymentMethod = await PaymentMethodController.getDefaultPaymentMethod(userId)
        if (availablePaymentMethod) {
            const updatedCustomer = await stripe.customers.update(availablePaymentMethod.customerId, {
                default_source: paymentMethodId
            });
            if (!updatedCustomer)
                throw new CustomError("Choose default cards error !!!!")
            // Gán default card vào db
            const newPaymentMethod = { ...availablePaymentMethod._doc, defaultCard: paymentMethodId }
            result = await PaymentMethodController.updatePaymentMethod(newPaymentMethod);
            console.log(result, newPaymentMethod);
        } else
            return res.status(200).json({ result: false, message: "ERROR WHILE CHOOSE DEFAULT CARD SUCCESSFUL !!!", statusCode: 200 })

        return res.status(200).json({ result: true, message: "CHOOSE DEFAULT CARD SUCCESSFUL !!!", statusCode: 200 })
    } catch (error) {
        console.log("ERROR CHOOSE DEFAULT CARD SUCCESSFUL: ", error);
        return res.status(500).json({ message: error, statusCode: 500 })
    }
})
router.get('/get-card-list/:userId', async (req, res, next) => {
    try {

        const { userId } = req.params;
        let data = null

        const availablePaymentMethod = await PaymentMethodController.getDefaultPaymentMethod(userId)
        const customerId = availablePaymentMethod.customerId;


        if (availablePaymentMethod) {

            const cards = await stripe.customers.listSources(customerId, {
                object: 'card', // 
            });
            data = cards
        } else
            return res.status(400).json({ result: false, data: null, message: "ERROR WHILE GET CARD'S LIST !!!", statusCode: 400 })
        return res.status(200).json({ result: true, data: data.data, message: "GET CARD'S LIST SUCCESSFUL !!!", statusCode: 200 })
    } catch (error) {
        console.log("ERROR GET CARD'S LIST: ", error);
        return res.status(500).json({ message: error, statusCode: 500 })
    }
})
router.post('/delete-card', async (req, res, next) => {
    try {

        const { userId, paymentMethodId } = req.query;
        const availablePaymentMethod = await PaymentMethodController.getDefaultPaymentMethod(userId)
        let newPaymentMethod = null
        if (availablePaymentMethod) {
            const customerId = availablePaymentMethod.customerId;
            const cards = await stripe.customers.deleteSource(customerId, paymentMethodId);
            if (!cards.deleted)
                throw new CustomError("ERROR WHILE DELETE CARDS !!!!")
            const customer = await stripe.customers.retrieve(customerId);

            // Lấy ID của thẻ mặc định
            const defaultCardId = customer.default_source;

            if (defaultCardId) {
                // Truy xuất thông tin chi tiết về thẻ mặc định
                newPaymentMethod = { ...availablePaymentMethod._doc, defaultCard: defaultCardId }
            } else {
                newPaymentMethod = { ...availablePaymentMethod._doc, defaultCard: "" }
            }
            const result = await PaymentMethodController.updatePaymentMethod(newPaymentMethod)
            console.log(result);
            return res.status(200).json({ result: true, data: result, message: "DELETE THE CARD SUCCESSFUL !!!", statusCode: 200 })

        } else
            return res.status(400).json({ result: false, message: "ERROR WHILE DELETE THE CARD !!!", statusCode: 400 })



    } catch (error) {
        console.log("DELETE THE CARD: ", error);
        return res.status(500).json({ message: error, statusCode: 500 })
    }
})
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