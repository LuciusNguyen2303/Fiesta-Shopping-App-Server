const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const { client_id } = require('./GoogleAuth/googleAuthVariables');
const { verifyAccessToken, createAccessToken } = require('../components/public method/jwtMethods');
const { checkRefreshToken } = require('../components/user/UserController');
const { messaging } = require('firebase-admin');
require('dotenv').config()

const authenticateToken = async (req, res, next) => {
    try {


        const authorizationHeader = req.headers['authorization'];
        if (authorizationHeader) {
            if (authorizationHeader.startsWith('Bearer ')) {
                console.log('Good to go');
            } else {
                console.log('Bad to go');
            }
        } else {
            console.log('Cant move to headers or headers not valid');
        }

        const token = authorizationHeader.split(' ')[1];

        if (!token) {
            console.log('Token is null');
            return res.sendStatus(401)
        } else {
            console.log('token: ' + token);
        }
        const check = verifyAccessToken(token)
        const decoded = jwt.decode(token)

        if (check.result && check.message == 0) {
            req.userId = decoded._id
            next();
        } else if (check.message == "TokenExpiredError") {
            const decoded = jwt.decode(token)
            const result = await checkRefreshToken(decoded);
            if (result) {
                return res.status(499).json({ result: true, token: createAccessToken(decoded), message: "NEWACCESSTOKEN" });
            }
            return res.status(499).json({ result: false, token: null, message: "Refresh token error: " + check.message });
        } else {
            return res.status(400).json({ result: false, token: null, message: check.message + "NOOOO" });
        }

    } catch (error) {
        return res.status(500).json({ result: false, token: null, message: check.message + "NOOOO" });

    }
}
// const authenticateTokenGG = async (req, res, next) => {
//     const authorizationHeader = req.headers['authorization'];
//     if (authorizationHeader) {
//         if (authorizationHeader.startsWith('Bearer ')) {
//             console.log('Good to go');
//         } else {
//             console.log('Bad to go');
//         }
//     } else {
//         console.log('Cant move to headers or headers not valid');
//     }

//     const token = authorizationHeader.split(' ')[1];

//     if (!token) {
//         console.log('Token is null');
//         next();
//     } else {
//         console.log('token: ' + token);
//     }
//     const client = new OAuth2Client(client_id);

//     (async () => {
//         const ticket = await client.verifyIdToken({
//             idToken: token,
//             audience: [
//                 client_id
//             ],
//         });

//         const payload = ticket.getPayload();
//         //  GOOD! idToken verification successful!
//         console.log(payload);
//     })().catch(error => {
//         const errorMessage = error.toString().split(":");
//         console.log("VERIFYING GOOGLE TOKENS ERRORS: " + errorMessage[1]);
//     });
//     next();
// }
module.exports = { authenticateToken };