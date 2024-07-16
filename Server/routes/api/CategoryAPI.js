const express = require('express')
const router = express.Router();
const categoryController = require('../../src/components/category/CategoryController')

// http://localhost:3000/api/category/addCategory

router.post('/addCategory', async (req, res, next) => {
    try {
        const data = req.body;
        if (data) {
            const result = await categoryController.addCategory(data)
            if (result)
                return res.status(200).json({ result: true, statusCode: 200 })
        }
        return res.status(204).json({
            result: false, statusCode: 204
        })
    } catch (error) {

        console.error(`Adding new category error (API): ${error}`);
        return res.status(500).json({ result: false, statusCode: 500, message: `Error: ${error}` })

    }
});

router.post('/editCategory', async (req, res, next) => {
    try {
        const data = req.body;

        if (data) {
            const id = data.id;
            const name = data.name;
            const image = data.image
            const result = await categoryController.editCategory(id, image, name)
            if (result)
                return res.status(200).json({ result: true, statusCode: 200 })
        }
        return res.status(204).json({
            result: false, statusCode: 204
        })
    } catch (error) {

        console.error(`Adding new category error (API): ${error}`);
        return res.status(500).json({ result: false, statusCode: 500, message: `Error: ${error}` })

    }
});
router.get('/getCategory', async (req, res, next) => {
    try {

        const data = await categoryController.getAllCategory()
        if (data)
            return res.status(200).json({ result: true, data: data, statusCode: 200 })

        return res.status(200).json({
            result: false, statusCode: 204, data: null
        })
    } catch (error) {

        console.error(`Getting all the categories error (API): ${error}`);
        return res.status(500).json({ result: false, statusCode: 500, message: ` ${error}` })

    }
});
router.post('/deleteCategory/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        if (id) {
            const result = await categoryController.deleteCategory(id)
            if (result)
                return res.status(200).json({ result: true, statusCode: 200 })
        }
        return res.status(200).json({
            result: false, statusCode: 204
        })
    } catch (error) {

        console.error(`Editing new category error (API): ${error}`);
        return res.status(500).json({ result: false, statusCode: 500, message: `Error: ${error}` })

    }
});
router.get('/getCategorybyId', async (req, res, next) => {
    try {
        const { id } = req.query;
        const result = await categoryController.getCategoryByID(id);
        if (result)
            return res.status(200).json({ result: true, data: result, message: 'get category by id success' })
        return res.status(200).json({ result: false, message: 'get category by id success' })
    } catch (error) {
        return res.status(500).json({ result: false, message: 'get category by id error (Api): ' + error })
    }
})
module.exports = router;