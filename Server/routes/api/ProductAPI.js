const express = require('express');
const router = express.Router();
const productController = require('../../src/components/product/ProductController')
const {uploadFile} = require("../../src/middleware/UploadFile");
const { totalPages } = require('../../src/components/public method');
const { countDocuments } = require('../../src/components/category/categoryModel');
const { authenticateToken } = require('../../src/middleware/jwtValidation');
const { AuthorizedForAdmin, AuthorizedForStaff, AuthorizedForCustomer } = require('../../src/middleware/Authorized');

// http://localhost:3000/api/productApi/addProduct
// Thêm sản phẩm
router.post('/addProduct',[authenticateToken,AuthorizedForAdmin,AuthorizedForStaff], async (req, res, next) => {
    try {
        let { body } = req;
        const {
            category, name, images, price, stock, brand, rating, description, variations
        } = body;
        const request = await productController.addProduct(
            category, name, images, price, stock, brand, rating, description, variations
        );

        return request ?
            res.status(200).json({ result: true, statusCode: 200, message: 'addProduct succesfully' }) :
            res.status(400).json({ result: false, statusCode: 400, message: 'addProduct failed' })
    } catch (error) {
        return res.status(500).json({ result: false, statusCode: 500, message: 'addProduct Error(Api): ' + error })
    }
})

// Lấy thông tin tất cả sản phẩm
router.get('/getAllProduct',[authenticateToken,AuthorizedForAdmin,AuthorizedForStaff], async (req, res, next) => {
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


router.get('/getProductListByCategory',[authenticateToken,AuthorizedForCustomer,AuthorizedForAdmin,AuthorizedForStaff], async (req, res, next) => {
    try {
        let { body } = req;
        const { pages } = body;
        const products = await productController.getAllProduct(name, price, quantity);
        return products ?
            res.status(200).json({ result: true, message: 'getAllProduct succesfully', data: products }) :
            res.status(400).json({ result: false, message: 'getAllProduct failed' })
    } catch (error) {
        return res.status(500).json({ result: false, message: 'getAllProduct Error(Api): ' + error })
    }
})
router.get('/getProductList',[authenticateToken,AuthorizedForCustomer,AuthorizedForAdmin,AuthorizedForStaff], async (req, res, next) => {
    try {
        let { body } = req;
        const { pages } = body;
        const products = await productController.getProductsByPage(pages);
        return products ?
            res.status(200).json({ result: true, message: 'getAllProduct succesfully', data: products }) :
            res.status(400).json({ result: false, message: 'getAllProduct failed' })
    } catch (error) {
        return res.status(500).json({ result: false, message: 'getAllProduct Error(Api): ' + error })
    }
})
router.get('/getProductListByStandard',[authenticateToken,AuthorizedForCustomer], async (req, res, next) => {
    try {
        let { type } = req.query;
        const products = await productController.getProductListByStandard(type);
        return products ?
            res.status(200).json({ result: true, message: 'getProductListByStandard succesfully', data: products }) :
            res.status(400).json({ result: false, message: 'getProductListByStandard failed' })
    } catch (error) {
        return res.status(500).json({ result: false, message: 'getProductListByStandard Error(Api): ' + error })
    }
})
router.get('/getProductListHome',[authenticateToken,AuthorizedForCustomer], async (req, res, next) => {
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
router.post('/updateProduct',[authenticateToken,AuthorizedForAdmin,AuthorizedForStaff], async (req, res, next) => {
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
router.get('/getProductByID',[authenticateToken,AuthorizedForAdmin,AuthorizedForCustomer,AuthorizedForStaff], async (req, res, next) => {
    try {
        let { id } = req.query
        const product = await productController.getProductByID(id);
        return product ?
            res.status(200).json({ result: true, message: 'getProductByID succesfully', data: product }) :
            res.status(400).json({ result: false, message: 'getProductByID failed' })
    } catch (error) {
        return res.status(500).json({ result: false, message: 'getProductByID Error(Api): ' + error })
    }
})
router.get('/getProductByID',[authenticateToken,AuthorizedForAdmin,AuthorizedForCustomer,AuthorizedForStaff], async (req, res, next) => {
    try {
        let { productID } = req.query
        const product = await productController.getProductByID(productID);
        return product ?
            res.status(200).json({ result: true, message: 'getProductByID succesfully', data: product }) :
            res.status(400).json({ result: false, message: 'getProductByID failed' })
    } catch (error) {
        return res.status(500).json({ result: false, message: 'getProductByID Error(Api): ' + error })
    }
})
router.post('/deleteAttributesInProduct',[authenticateToken,AuthorizedForAdmin,AuthorizedForStaff], async (req, res, next) => {
    try {
        let { productID } = req.query
        let { updateFields } = req.body
        const product = await productController.deleteAttributesInProduct(productID, updateFields);
        return product ?
            res.status(200).json({ result: true, message: 'getProductByID succesfully', data: product }) :
            res.status(400).json({ result: false, message: 'getProductByID failed' })
    } catch (error) {
        return res.status(500).json({ result: false, message: 'getProductByID Error(Api): ' + error })
    }
})
router.post('/deleteProduct',[authenticateToken,AuthorizedForAdmin,AuthorizedForStaff], async (req, res, next) => {
    try {
        let { updateFields } = req.body
        const { productIDs } = updateFields
        const product = await productController.deleteProduct(productIDs);
        return product ?
            res.status(200).json({ result: true, message: 'getProductByID succesfully', data: product }) :
            res.status(400).json({ result: false, message: 'getProductByID failed' })
    } catch (error) {
        return res.status(500).json({ result: false, message: 'getProductByID Error(Api): ' + error })
    }
})
// Tìm kiếm sản phẩm theo điều kiện
router.get('/searchProducts',[authenticateToken,AuthorizedForCustomer], async (req, res, next) => {
    // try {
        const products = await productController.searchProducts(req);
        console.log(JSON.stringify(req.query));
        return products != null ?
            res.status(200).json({ result: true, message: 'searchProducts succesfully', data: products.products, documents: products.countDocument,totalPage:req.query.limit?totalPages(products.countDocument,req.query.limit):null }) :
            res.status(200).json({ result: true, message: 'not product found', data: products })
    // } catch (error) {
    //     return res.status(500).json({ result: false, message: 'searchProducts Error(Api): ' + error })
    // }
})
router.get('/checkVaritationProductStock',[authenticateToken,AuthorizedForCustomer], async (req, res, next) => {
    try {
        const stock = await productController.checkProductVariationStock(req)
        if(stock)
        return res.status(200).json({ result: true, data: stock })
        return res.status(200).json({ result: false, data: stock })
    } catch (error) {
        console.log('checkProductVariationStock error (Api): ' + error);
    }
})
router.get('/getStockProduct',[authenticateToken,AuthorizedForCustomer], async (req, res, next) => {
    try {
        const {productId,variationId} = req.query;
        const stock = await productController.getStockProduct(productId,variationId)
        if(stock)
        return res.status(200).json({ result: true, data: stock })
        return res.status(200).json({ result: false, data: stock })
    } catch (error) {
        console.log('checkProductVariationStock error (Api): ' + error);
    }
})
router.post('/getStockManyProducts',[authenticateToken,AuthorizedForCustomer], async (req, res, next) => {
    try {
        const {items} = req.body;
        
        const stock = await productController.getStockManyProduct(items)
        console.log(JSON.stringify(items),JSON.stringify(stock));

        if(stock)
        return res.status(200).json({ result: true, data: stock })
        return res.status(200).json({ result: false, data: stock })
    } catch (error) {
        console.log('getStockManyProducts error (Api): ' + error);
    }
})
module.exports = router;