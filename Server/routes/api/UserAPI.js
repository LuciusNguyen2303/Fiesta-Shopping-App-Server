const express = require('express');
const router = express.Router();
const userController = require('../../src/components/user/UserController')
const { addUser_Validation } = require('../../src/middleware/userValidation');
const { authenticateToken } = require('../../src/middleware/jwtValidation')
router.post('/addUser', [addUser_Validation], async (req, res, next) => {
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
router.post('/login', [authenticateToken],async (req, res, next) => {
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