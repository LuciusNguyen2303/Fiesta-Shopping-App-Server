const express = require('express');
const router = express.Router();
const userController = require('../../src/components/user/UserController')
const { addUser_Validation } = require('../../src/middleware/userValidation');
const { authenticateToken, authenticateTokenGG } = require('../../src/middleware/jwtValidation')
const {AuthorizedForAdmin,AuthorizedForCustomer,AuthorizedForStaff} =require("../../src/middleware/Authorized");
const { uploadMultipleImages, deleteImages, uploadImage } = require('../../src/components/public method/ImageMethod/ImageMethods');
// http://localhost:3000/api/userApi/

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
router.post('/testAuthen',async (req, res, next) => {
    try {
        const {address}= req.body;
      

        return res.status(200).json({ result: true,data:address, message:"Token is valid" })

    } catch (error) {
        return res.status(500).json({ result: false, message: 'addUser Error(Api): ' + error })
    }
})

router.post('/updateUser/:id',async (req, res, next) => {
    try {
        const {id}=req.params
        const {updateFields}= req.body;
        const result = await userController.updateUserInfo(id,updateFields)

        return res.status(200).json({ result: true,data:result })

    } catch (error) {
        return res.status(500).json({ result: false, message: 'updateUser Error(Api): ' + error })
    }
})
router.post('/changePassword',async (req, res, next) => {
    try {
        const {username,currentPassword,newPassword}= req.body;
        const result = await userController.changePassword(username,currentPassword,newPassword)
        if(result)
        return res.status(200).json({ result: true,data:result})
        return res.status(400).json({ result: false,data:null})

    } catch (error) {
        return res.status(500).json({ result: false, message: 'changePassword Error(Api): ' + error })
    }
})
router.post('/GrantedPermissions',async (req, res, next) => {
    try {
        const { userId } = req.query;
        const response = await userController.GrantedPermissions(userId);
        return response ?
            res.status(200).json({ result: true, message: 'GrantedPermissions successfully' }) :
            res.status(400).json({ result: false, message: 'GrantedPermissions failed' })
    } catch (error) {
        return res.status(500).json({ result: false, message: 'GrantedPermissions Error(Api): ' + error })
    }
})
router.post('/Authorized',async (req, res, next) => {
    try {
        const { userId } = req.query;
        const response = await userController.Authorized(userId);
        return response ?
            res.status(200).json({ result: true, message: 'Authorized successfully'}) :
            res.status(400).json({ result: false, message: 'Authorized failed' })
    } catch (error) {
        return res.status(500).json({ result: false, message: 'addUser Error(Api): ' + error })
    }
})
router.post('/LockUser',async (req, res, next) => {
    try {
        const { userId  } = req.query;
        const response = await userController.LockUser(userId)
        return response ?
            res.status(200).json({ result: true, message: 'LockUser successfully', token: response }) :
            res.status(400).json({ result: false, message: 'LockUser failed' })
    } catch (error) {
        return res.status(500).json({ result: false, message: 'LockUser Error(Api): ' + error })
    }
})
router.post('/DeleteUser',async (req, res, next) => {
    try {
        const { userId } = req.query;
        const response = await userController.DeleteUser(userId);
        return response ?
            res.status(200).json({ result: true, message: 'DeleteUser successfully' }) :
            res.status(400).json({ result: false, message: 'DeleteUser failed' })
    } catch (error) {
        return res.status(500).json({ result: false, message: 'DeleteUser Error(Api): ' + error })
    }
})
router.post('/UndoUser',async (req, res, next) => {
    try {
        const { userId } = req.query;
        const response = await userController.UndoUser(userId);
        return response ?
            res.status(200).json({ result: true, message: 'UndoUser successfully', token: response }) :
            res.status(400).json({ result: false, message: 'UndoUser failed' })
    } catch (error) {
        return res.status(500).json({ result: false, message: 'UndoUser Error(Api): ' + error })
    }
})
router.post('/UnlockUser',async (req, res, next) => {
    try {
        const { userId } = req.query;
        const response = await userController.UnlockUser(userId);
        return response ?
            res.status(200).json({ result: true, message: 'UnlockUser successfully', token: response }) :
            res.status(400).json({ result: false, message: 'UnlockUser failed' })
    } catch (error) {
        return res.status(500).json({ result: false, message: 'UnlockUser Error(Api): ' + error })
    }
})
module.exports = router;