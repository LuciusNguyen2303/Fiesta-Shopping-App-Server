const jwt = require('jsonwebtoken');
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