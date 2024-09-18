const express = require('express');
const router = express.Router();
const path = require('path')
const userController = require('../../src/components/user/UserController')
const { addUser_Validation } = require('../../src/middleware/userValidation');
const { uploadFile } = require("../../src/middleware/UploadFile")
const fs = require('fs');
const { hostAddingImageToCDN, hostUpdateImageToCDN } = require('./ImageMethod/ImageMethod');
const { sendEmail } = require("../../src/components/public method/EmailMethod/EmailInitization")
const { authenticateToken } = require('../../src/middleware/jwtValidation');
const { AuthorizedForAdmin, AuthorizedForStaff, AuthorizedForCustomer } = require('../../src/middleware/Authorized');
const verificationCodeController = require("../../src/components/VerificationCode/VerificationCodeController")
// http://localhost:3000/api/userApi/addUser

router.post('/addUser', async (req, res, next) => {
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
        const { userName, cpassword } = req.body;
        const response = await userController.signIn(userName, cpassword);
        console.log(response.token);
        const { refreshToken, role, isLock, isHidden, password, ...user } = response.user._doc
        return response ?
            res.status(200).json({ result: true, message: 'Login successfully', token: response.token.accessToken, user: user, statusCode: 200 }) :
            res.status(400).json({ result: false, message: 'Login failed', statusCode: 400 })
    } catch (error) {

        return res.status(500).json({ result: false, message: 'Login Error(Api): ' + error, statusCode: 500 })
    }
})



/** 
* @param {"Users" | "Categories" | "Reviews"|"Products"} pathR


*/
router.get("/getUserInfo/:id", [authenticateToken], async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = await userController.getUserbyId(id)
        return data ? res.status(200).json({ user: data, statusCode: 200, message: "Get the user's information successfully" })
            : res.status(400).json({ user: data, statusCode: 200, message: "No user available!!" })
    } catch (error) {
        return res.status(500).json({ error: error, statusCode: 500 })
    }
})
router.get('/user', [authenticateToken], async (req, res, next) => {
    try {
        const { userId } = req
        const data = await userController.getUserbyId(userId)
        return res.status(200).json({ result: true, data: data, message: "Token is valid" })

    } catch (error) {
        console.log('addUser Error(Api): ' + error);
        return res.status(500).json({ result: false, message: 'addUser Error(Api): ' + error })
    }
})
function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// http://localhost:3000/api/userApi/sendVerificationCode/userId/email
router.post('/sendVerificationCode/:userId/:email', [
    // authenticateToken
], async (req, res, next) => {
    try {
        const { email, userId } = req.params
        const verificationCode = randomInteger(100000, 999999)
        let isSent = false;
        const result = await verificationCodeController.saveVerificationController(userId, verificationCode)
        if (result)
            isSent = await sendEmail(email, verificationCode)
        console.log(isSent);
        
        return result ? res.status(200).json({ result: true, isSent: isSent ? true : false, emailSent: email }) :
            res.status(400).json({ result: false, data: null })


    } catch (error) {
        return res.status(500).json({ result: false, message: 'updateUser Error(Api): ' + error })
    }
})
// http://localhost:3000/api/userApi/verifyCode/userId/verificationCode
router.get('/verifyCode/:userId/:verificationCode',
    [
        // authenticateToken
    ]
    , async (req, res, next) => {
        try {
            const { verificationCode, userId } = req.params
            const result = await verificationCodeController.checkVerificationController(userId, verificationCode)

            if (result !== null)
                return res.status(200).json({ result: true, isVerified: result })
            else
                throw new Error("Error check verificationCode in db")

        } catch (error) {
            return res.status(500).json({ result: false, message: 'updateUser Error(Api): ' + error })
        }
    })
router.post('/updateUser/:id', [
    // authenticateToken
    uploadFile], async (req, res, next) => {
        try {
            const { id } = req.params
            const { updateFields } = req.body;
            const updatedData = await hostUpdateImageToCDN(JSON.parse(updateFields), req, "Users")
            const result = await userController.updateUserInfo(id, updatedData)
            console.log(result);

            return result ? res.status(200).json({ result: true, data: result }) :
                res.status(400).json({ result: false, data: null })


        } catch (error) {
            return res.status(500).json({ result: false, message: 'updateUser Error(Api): ' + error })
        }
    })
router.post('/changePassword', [authenticateToken,], async (req, res, next) => {
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
router.post('/GrantedPermissions', [authenticateToken, AuthorizedForAdmin], async (req, res, next) => {
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
router.post('/Authorized', [authenticateToken, AuthorizedForAdmin], async (req, res, next) => {
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
router.post('/LockUser', [authenticateToken, AuthorizedForAdmin], async (req, res, next) => {
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
router.post('/DeleteUser', [authenticateToken, AuthorizedForAdmin], async (req, res, next) => {
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
router.post('/UndoUser', [authenticateToken, AuthorizedForAdmin], async (req, res, next) => {
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
router.post('/UnlockUser', [authenticateToken, AuthorizedForAdmin], async (req, res, next) => {
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
router.post('/addNewAddress', [authenticateToken, AuthorizedForCustomer], async (req, res, next) => {
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
router.post('/updateAddress', [authenticateToken, AuthorizedForCustomer], async (req, res, next) => {
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
router.post('/deleteAddress', [authenticateToken, AuthorizedForCustomer], async (req, res, next) => {
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
router.post('/setDefaultAddress', [authenticateToken, AuthorizedForCustomer], async (req, res, next) => {
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