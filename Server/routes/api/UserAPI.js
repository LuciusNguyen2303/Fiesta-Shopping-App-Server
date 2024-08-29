const express = require('express');
const router = express.Router();
const path = require('path')
const userController = require('../../src/components/user/UserController')
const { addUser_Validation } = require('../../src/middleware/userValidation');
const { authenticateToken, authenticateTokenGG } = require('../../src/middleware/jwtValidation')
const { AuthorizedForAdmin, AuthorizedForCustomer, AuthorizedForStaff } = require("../../src/middleware/Authorized");
const { uploadFile } = require("../../src/middleware/UploadFile")
const fs = require('fs');
const { hostAddingImageToCDN, hostUpdateImageToCDN } = require('./ImageMethod/ImageMethod');
// http://localhost:3000/api/userApi/addUser

router.post('/addUser', [addUser_Validation], async (req, res, next) => {
    try {
        const { name, userName, password } = req.body;
        console.log(name, userName, password);
        const newUser = await userController.addUser(name, userName, password);
        return newUser ?
            res.status(200).json({ result: true, message: 'addUser successfully' }) :
            res.status(400).json({ result: false, message: 'Username already exists' })
    } catch (error) {
        return res.status(500).json({ result: false, message: 'addUser Error(Api): ' + error })
    }
})

// http://localhost:3000/api/userApi/login
router.post('/login', async (req, res, next) => {
    try {
        const { userName, password } = req.body;
        const response = await userController.signIn(userName, password);
        return response ?
            res.status(200).json({ result: true, message: 'Login successfully', data: response, statusCode: 200 }) :
            res.status(400).json({ result: false, message: 'Login failed', statusCode: 400 })
    } catch (error) {
        return res.status(500).json({ result: false, message: 'addUser Error(Api): ' + error, statusCode: 500 })
    }
})



/** 
* @param {"Users" | "Categories" | "Reviews"|"Products"} pathR


*/
router.get("/getUserInfo/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = await userController.getUserbyId(id)
        return data ? res.status(200).json({ user: data, statusCode: 200, message: "Get the user's information successfully" })
            : res.status(400).json({ user: data, statusCode: 200, message: "No user available!!" })
    } catch (error) {
        return res.status(500).json({ error: error, statusCode: 500 })
    }
})
router.post('/testAuthen', [authenticateToken], async (req, res, next) => {
    try {
       

        return res.status(200).json({ result: true, message: "Token is valid" })

    } catch (error) {
        console.log('addUser Error(Api): ' + error);
        return res.status(500).json({ result: false, message: 'addUser Error(Api): ' + error })
    }
})

router.post('/updateUser/:id', [uploadFile], async (req, res, next) => {
    try {
        const { id } = req.params
        const { updateFields } = req.body;
        const updatedData = await hostUpdateImageToCDN(JSON.parse(updateFields), req, "Users")
        // console.log(">>>updatedData",JSON.stringify(updatedData))
        const result = await userController.updateUserInfo(id, updatedData)

        return result ? res.status(200).json({ result: true, data: result }) :
            res.status(400).json({ result: false, data: result })


    } catch (error) {
        return res.status(500).json({ result: false, message: 'updateUser Error(Api): ' + error })
    }
})
router.post('/changePassword', async (req, res, next) => {
    try {
        const { username, currentPassword, newPassword } = req.body;
        const result = await userController.changePassword(username, currentPassword, newPassword)
        if (result)
            return res.status(200).json({ result: true, data: result })
        return res.status(400).json({ result: false, data: null })

    } catch (error) {
        return res.status(500).json({ result: false, message: 'changePassword Error(Api): ' + error })
    }
})
router.post('/GrantedPermissions', async (req, res, next) => {
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
router.post('/Authorized', async (req, res, next) => {
    try {
        const { userId } = req.query;
        const response = await userController.Authorized(userId);
        return response ?
            res.status(200).json({ result: true, message: 'Authorized successfully' }) :
            res.status(400).json({ result: false, message: 'Authorized failed' })
    } catch (error) {
        return res.status(500).json({ result: false, message: 'addUser Error(Api): ' + error })
    }
})
router.post('/LockUser', async (req, res, next) => {
    try {
        const { userId } = req.query;
        const response = await userController.LockUser(userId)
        return response ?
            res.status(200).json({ result: true, message: 'LockUser successfully', token: response }) :
            res.status(400).json({ result: false, message: 'LockUser failed' })
    } catch (error) {
        return res.status(500).json({ result: false, message: 'LockUser Error(Api): ' + error })
    }
})
router.post('/DeleteUser', async (req, res, next) => {
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
router.post('/UndoUser', async (req, res, next) => {
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
router.post('/UnlockUser', async (req, res, next) => {
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
router.post('/addNewAddress', async (req, res, next) => {
    try {
        const { userId, addFields } = req.body;
        
        const response = await userController.addNewAddress(userId, addFields)
        return response ?
            res.status(200).json({ result: true, message: 'add new address successfully', data: response, statusCode: 200 }) :
            res.status(400).json({ result: false, message: 'add new address failed', statusCode: 400 })
    } catch (error) {
        res.status(500).json({ result: false, message: 'add new address error(Api): ' + error })
    }
})
router.post('/updateAddress', async (req, res, next) => {
    try {
        const { userId, updateFields, addressId } = req.body;
        const response = await userController.updateAddress(userId, updateFields, addressId)
        return response ?
            res.status(200).json({ result: true, message: 'update address successfully', data: response, statusCode: 200 }) :
            res.status(400).json({ result: false, message: 'update address failed', statusCode: 400 })
    } catch (error) {
        res.status(500).json({ result: false, message: 'update address error(Api): ' + error })
    }
})
router.post('/deleteAddress', async (req, res, next) => {
    try {
        const { userId, addressId } = req.body;
        const response = await userController.deleteAddress(userId, addressId)
        return response ?
            res.status(200).json({ result: true, message: 'delete address successfully', data: response, satusCode: 200 }) :
            res.status(400).json({ result: false, message: 'delete address failed' })
    } catch (error) {
        res.status(500).json({ result: false, message: 'delete address error(Api): ' + error })
    }
})
router.post('/setDefaultAddress', async (req, res, next) => {
    try {
        const { userId, addressId } = req.body;
        const response = await userController.setDefaultAddress(userId, addressId)
        return response ?
            res.status(200).json({ result: true, message: 'delete address successfully', data: response }) :
            res.status(400).json({ result: false, message: 'delete address failed' })
    } catch (error) {
        res.status(500).json({ result: false, message: 'delete address error(Api): ' + error })
    }
})
module.exports = router;