const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const { client_id } = require('./GoogleAuth/googleAuthVariables');
require('dotenv').config()

const authenticateToken = (req, res, next) => {
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
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log(err.message);
            return res.sendStatus(401);
        }
        req.user = user;
        next();
    });
}

module.exports = { authenticateToken };
const authenticateTokenGG = async (req, res, next) => {
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
        next();
    } else {
        console.log('token: ' + token);
    }
    const client = new OAuth2Client(client_id);

    (async () => {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: [
                client_id
            ],
        });

        const payload = ticket.getPayload();
         //  GOOD! idToken verification successful!
        console.log(payload);
    })().catch(error => {
        const errorMessage = error.toString().split(":");
console.log("VERIFYING GOOGLE TOKENS ERRORS: " + errorMessage[1]);
    });
    next();
}
module.exports = { authenticateToken, authenticateTokenGG };
