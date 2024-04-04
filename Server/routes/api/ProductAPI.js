const express = require('express');
const router = express.Router();
const productController = require('../../src/components/product/ProductController')
router.post('/addProduct', async (req, res, next) => {
    try {
        let { body } = req;
        const { name, price, quantity } = body;
        const request = await productController.addProduct(name, price, quantity);
        return request ?
            res.status(200).json({ result: true, message: 'addProduct succesfully' }) :
            res.status(400).json({ result: false, message: 'addProduct failed' })
    } catch (error) {
        return res.status(500).json({ result: false, message: 'addProduct Error(Api): ' + error })
    }
})
module.exports = router;