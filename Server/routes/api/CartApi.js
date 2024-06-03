const express = require('express')
const router = express.Router();
const cartController = require("../../src/components/cart/cartController")

// http://localhost:3000/api/cart/
router.post("/add", async (req, res, nex) => {
    try {
        const { addFields } = req.body;

        const request = await cartController.addCarts(addFields)

        return request ?
            res.status(200).json({ result: true, statusCode: 200, message: 'add succesfully',data:request }) :
            res.status(400).json({ result: false, statusCode: 400, message: 'add failed' })
    } catch (error) {
        return res.status(500).json({ result: false, statusCode: 500, message: 'add Error(Api): ' + error })

    }
})
router.post("/update", async (req, res, nex) => {
    try {
        const { updateFields } = req.body;
        const { cartID} = req.query;
        const request = await cartController.updateCart(cartID,updateFields)

        return request ?
            res.status(200).json({ result: true, statusCode: 200, message: 'update succesfully' }) :
            res.status(400).json({ result: false, statusCode: 400, message: 'update failed' })
    } catch (error) {
        return res.status(500).json({ result: false, statusCode: 500, message: 'update Error(Api): ' + error })

    }
})
router.post("/delete", async (req, res, nex) => {
    try {
        const { cartID, variationIds } = req.body;
        const request = await cartController.deleteCart(cartID, variationIds)

        return request ?
            res.status(200).json({ result: true, statusCode: 200, message: 'delete succesfully' }) :
            res.status(400).json({ result: false, statusCode: 400, message: 'delete failed' })
    } catch (error) {
        return res.status(500).json({ result: false, statusCode: 500, message: 'delete Error(Api): ' + error })

    }
})
router.get("/getByPage/:page/:userId", async (req, res, nex) => {
    try {
        const { page, userId } = req.params;
        const request = await cartController.getCartsByPage(userId, page)
        return request ?
            res.status(200).json({ result: true, statusCode: 200, message: 'getByPage succesfully',data:request }) :
            res.status(400).json({ result: false, statusCode: 400, message: 'getByPage failed' })
    } catch (error) {
        return res.status(500).json({ result: false, statusCode: 500, message: 'getByPage Error(Api): ' + error })

    }
})
module.exports = router