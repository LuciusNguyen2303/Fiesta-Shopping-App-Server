const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
require('dotenv').config()
router.post('/refreshToken', async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        const { a, b } = req.body;
        if (!refreshToken) {
            return res.status(401)
        }
        jwt.verify(refreshToken, process.env.ACCESS_REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                console.log(err.message);
                return res.sendStatus(401);
            }
            req.user = user;
            next();
        });
        return typeof a != 'undefined' ? res.status(200) : res.status(500)
    } catch (error) {
        console.log("refreshToken error: " + error);
    }
})
function createToken(payload) {
    return jwt.sign({ userId: payload }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2m' })
}
function createRefreshToken(payload) {
    return jwt.sign({ userId: payload }, process.env.ACCESS_REFRESH_TOKEN_SECRET, { expiresIn: '2m' })
}
module.exports = router;