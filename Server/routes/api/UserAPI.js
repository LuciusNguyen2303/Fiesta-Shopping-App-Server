const express = require('express');
const router = express.Router();
const userController = require('../../src/components/user/UserController')
const { addUser_Validation } = require('../../src/middleware/userValidation');
const { authenticateToken, authenticateTokenGG } = require('../../src/middleware/jwtValidation')
const {AuthorizedForAdmin,AuthorizedForCustomer,AuthorizedForStaff} =require("../../src/middleware/Authorized")
// http://localhost:3000/api/user/

router.post('/addUser' ,[addUser_Validation],async (req, res, next) => {
    try {
        const { name, userName, password, gender } = req.body;
        const newUser = await userController.addUser(name, userName, password, gender);
        return newUser ?
            res.status(200).json({ result: true, message: 'addUser successfully', data: newUser }) :
            res.status(400).json({ result: false, message: 'Username already exists', data: null })
    } catch (error) {
        return res.status(500).json({ result: false, message: 'addUser Error(Api): ' + error })
    }
})

// http://localhost:3000/api/userApi/login
router.post('/login',async (req, res, next) => {
    try {
        const { userName, password } = req.body;
        const response = await userController.signIn(userName, password);
        return response ?
            res.status(200).json({ result: true, message: 'Login successfully', token: response }) :
            res.status(400).json({ result: false, message: 'Login failed' })
    } catch (error) {
        return res.status(500).json({ result: false, message: 'addUser Error(Api): ' + error })
    }
})
router.post('/testAuthen',[authenticateToken,AuthorizedForStaff],async (req, res, next) => {
    try {
        return res.status(200).json({ result: true, message:"Token is valid" })

    } catch (error) {
        return res.status(500).json({ result: false, message: 'addUser Error(Api): ' + error })
    }
})
router.post('/GrantedPermissions',async (req, res, next) => {
    try {
        const { userName, password } = req.body;
        const response = await userController.signIn(userName, password);
        return response ?
            res.status(200).json({ result: true, message: 'Login successfully', token: response }) :
            res.status(400).json({ result: false, message: 'Login failed' })
    } catch (error) {
        return res.status(500).json({ result: false, message: 'addUser Error(Api): ' + error })
    }
})
router.post('/Authorized',async (req, res, next) => {
    try {
        const { userName, password } = req.body;
        const response = await userController.signIn(userName, password);
        return response ?
            res.status(200).json({ result: true, message: 'Login successfully', token: response }) :
            res.status(400).json({ result: false, message: 'Login failed' })
    } catch (error) {
        return res.status(500).json({ result: false, message: 'addUser Error(Api): ' + error })
    }
})
router.post('/LockUser',async (req, res, next) => {
    try {
        const { userName, password } = req.body;
        const response = await userController.signIn(userName, password);
        return response ?
            res.status(200).json({ result: true, message: 'Login successfully', token: response }) :
            res.status(400).json({ result: false, message: 'Login failed' })
    } catch (error) {
        return res.status(500).json({ result: false, message: 'addUser Error(Api): ' + error })
    }
})
router.post('/UndoUser',async (req, res, next) => {
    try {
        const { userName, password } = req.body;
        const response = await userController.signIn(userName, password);
        return response ?
            res.status(200).json({ result: true, message: 'Login successfully', token: response }) :
            res.status(400).json({ result: false, message: 'Login failed' })
    } catch (error) {
        return res.status(500).json({ result: false, message: 'addUser Error(Api): ' + error })
    }
})
router.post('/UndoUser',async (req, res, next) => {
    try {
        const { userName, password } = req.body;
        const response = await userController.signIn(userName, password);
        return response ?
            res.status(200).json({ result: true, message: 'Login successfully', token: response }) :
            res.status(400).json({ result: false, message: 'Login failed' })
    } catch (error) {
        return res.status(500).json({ result: false, message: 'addUser Error(Api): ' + error })
    }
})
module.exports = router;