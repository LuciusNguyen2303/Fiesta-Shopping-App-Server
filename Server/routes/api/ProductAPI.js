const express = require('express');
const router = express.Router();
const productController = require('../../src/components/product/ProductController')

// Thêm sản phẩm
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

// Lấy thông tin tất cả sản phẩm
router.get('/getAllProduct', async (req, res, next) => {
    try {
        let { body } = req;
        const { name, price, quantity } = body;
        const products = await productController.getAllProduct(name, price, quantity);
        return products ?
            res.status(200).json({ result: true, message: 'getAllProduct succesfully', data: products }) :
            res.status(400).json({ result: false, message: 'getAllProduct failed' })
    } catch (error) {
        return res.status(500).json({ result: false, message: 'getAllProduct Error(Api): ' + error })
    }
})

// Sửa thông tin sản phẩm theo ID
router.post('/updateProduct', async (req, res, next) => {
    try {
        let { productID } = req.query;
        const { updateFields } = req.body;
        const productUpdated = await productController.updateProduct(productID, updateFields)
        return productUpdated ?
            res.status(200).json({ result: true, message: 'updateProduct succesfully', data: productUpdated }) :
            res.status(400).json({ result: false, message: 'updateProduct failed' })
    } catch (error) {
        return res.status(500).json({ result: false, message: 'updateProduct Error(Api): ' + error })
    }
})

// Lấy thông tin sản phẩm theo ID
router.get('/getProductByID', async (req, res, next) => {
    try {
        let {productID} = req.query
        const product = await productController.getProductByID(productID);
        return product ?
            res.status(200).json({ result: true, message: 'getProductByID succesfully', data: product }) :
            res.status(400).json({ result: false, message: 'getProductByID failed' })
    } catch (error) {
        return res.status(500).json({ result: false, message: 'getProductByID Error(Api): ' + error })
    }
})

// Tìm kiếm sản phẩm theo điều kiện
router.get('/searchProducts', async (req, res, next) => {
    try {
        let {searchFields} = req.body;
        const products = await productController.searchProducts(searchFields);
        return products != null?
            res.status(200).json({ result: true, message: 'searchProducts succesfully', data: products }) :
            res.status(200).json({ result: true, message: 'not product found', data: products })
    } catch (error) {
        return res.status(500).json({ result: false, message: 'searchProducts Error(Api): ' + error })
    }
})
module.exports = router;