const express = require('express');
const router = express.Router();
const productController = require('../../src/components/product/ProductController')
const {uploadFile} = require("../../src/middleware/UploadFile");
const { totalPages } = require('../../src/components/public method');
const { countDocuments } = require('../../src/components/category/categoryModel');
const { authenticateToken } = require('../../src/middleware/jwtValidation');
const { AuthorizedForAdmin, AuthorizedForStaff, AuthorizedForCustomer } = require('../../src/middleware/Authorized');
const { hostAddingImageToCDN, hostUpdateImageToCDN } = require('./ImageMethod/ImageMethod');

// http://localhost:3000/api/productApi/addProduct
// Thêm sản phẩm
router.post('/addProduct',[
        // authenticateToken,AuthorizedForAdmin,
    uploadFile], async (req, res, next) => {
    try {

       console.log(JSON.parse(req.body.data));
       
        const updatedData = await hostAddingImageToCDN(JSON.parse(req.body.data), req, "Products")
        
        const request = await productController.addProduct(
            updatedData
        );

        return request ?
            res.status(200).json({ result: true, statusCode: 200, message: 'addProduct succesfully' }) :
            res.status(400).json({ result: false, statusCode: 400, message: 'addProduct failed' })
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({ result: false, statusCode: 500, message: 'addProduct Error(Api): ' + error })
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


router.get('/getProductListByCategory', async (req, res, next) => {
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
router.get('/getProductList', async (req, res, next) => {
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
router.get('/getProductListByStandard', async (req, res, next) => {
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
router.get('/getProductListHome', async (req, res, next) => {
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
router.post('/updateProduct',[
    // authenticateToken,AuthorizedForAdmin,
    uploadFile
], async (req, res, next) => {
    try {
        let { productID } = req.query;
        const { updateFields } = req.body;
        console.log(req.body);
        const updatedData = await hostUpdateImageToCDN(JSON.parse(updateFields), req, "Products")
       
        
        const productUpdated = await productController.updateProduct(productID, updatedData)
        return productUpdated ?
            res.status(200).json({ result: true, message: 'updateProduct succesfully', data: productUpdated }) :
            res.status(400).json({ result: false, message: 'updateProduct failed' })


    } catch (error) {
        console.log('updateProduct Error(Api): ' + error);
        
        return res.status(500).json({ result: false, message: 'updateProduct Error(Api): ' + error })
    }
})

// Lấy thông tin sản phẩm theo ID
router.get('/getProductByID',[
    // authenticateToken
], async (req, res, next) => {
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
router.get('/getProductByID', async (req, res, next) => {
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

router.post('/deleteProduct',[authenticateToken,AuthorizedForAdmin], async (req, res, next) => {
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
router.get('/searchProducts', async (req, res, next) => {
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
router.get('/checkVaritationProductStock', async (req, res, next) => {
    try {
        const stock = await productController.checkProductVariationStock(req)
        if(stock)
        return res.status(200).json({ result: true, data: stock })
        return res.status(200).json({ result: false, data: stock })
    } catch (error) {
        console.log('checkProductVariationStock error (Api): ' + error);
    }
})
router.get('/getStockProduct', async (req, res, next) => {
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
router.post('/getStockManyProducts', async (req, res, next) => {
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

router.post('/getStockManyProducts', async (req, res, next) => {
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
router.post('/addNewVariation',[
    authenticateToken,AuthorizedForAdmin,
    uploadFile], async (req, res, next) => {
    try {
        const {productID} = req.query

        const updatedData = await hostAddingImageToCDN(JSON.parse(req.body.addFields), req, "Products")
        
        const request = await productController.addNewVariation(
            productID,
            updatedData
        );

        return request ?
            res.status(200).json({ result: true, statusCode: 200, message: 'addNewVariation succesfully',newVariationId:request._id }) :
            res.status(400).json({ result: false, statusCode: 400, message: 'addNewVariation failed' })
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({ result: false, statusCode: 500, message: 'addProduct Error(Api): ' + error })
    }
})

router.post('/updateVariation',[
    authenticateToken,AuthorizedForAdmin,
    uploadFile], async (req, res, next) => {
    try {
        const {productID} = req.query
        
        const updatedData = await hostUpdateImageToCDN(JSON.parse(req.body.updateFields), req, "Products")
        
        const request = await productController.updateVariation(
            productID,
            updatedData
        );

        return request ?
            res.status(200).json({ result: true, statusCode: 200, message: 'addProduct succesfully' }) :
            res.status(400).json({ result: false, statusCode: 400, message: 'addProduct failed' })
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({ result: false, statusCode: 500, message: 'addProduct Error(Api): ' + error })
    }
})
router.post('/deleteVariation',[
    authenticateToken
    ,AuthorizedForAdmin,
    uploadFile
], async (req, res, next) => {
    try {
        let { productID } = req.query
        let { updateFields } = req.body
        console.log("deleteVariation",JSON.parse(updateFields));
        
        const product = await productController.deleteVariation(productID, JSON.parse(updateFields));
        return product ?
            res.status(200).json({ result: true, message: 'getProductByID succesfully', data: product }) :
            res.status(400).json({ result: false, message: 'getProductByID failed' })
    } catch (error) {
        console.log("getProductByID Error(Api): ",error);
        
        return res.status(500).json({ result: false, message: 'getProductByID Error(Api): ' + error })
    }
})
module.exports = router;