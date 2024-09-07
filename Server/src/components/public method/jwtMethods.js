
/**  
* @param {string} verifiedToken 
* @param {Object} user
*/
const jwt = require('jsonwebtoken')
require('dotenv').config()

const expireAccessTokenTime='3m'
const expireRefreshTokenTime='10m'


const createAccessToken = (user) => {
  try {
    const token = jwt.sign(
        {
            _id: user._id,
            userName: user.userName,
            role: user.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: expireAccessTokenTime });
    return token;
  } catch (error) {
    console.log(`Error create Access token: ${error}`);
        return null
  }

}
const createRefreshToken = (user) => {
    try {
        const token = jwt.sign(
            {
                id: user._id,
                userName: user.userName,
                role: user.role
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: expireRefreshTokenTime });
        return token;
    } catch (error) {
        console.log(`Error create Refresh token: ${error}`);
        return null
    }
}

const verifyAccessToken = (verifiedToken) => {
    try {
        let message="";
        const token = jwt.verify(
            verifiedToken,
            process.env.ACCESS_TOKEN_SECRET, 
            function (err, decoded) {
                if (err) {
                    /*
                      err = {
                        name: 'TokenExpiredError',
                        message: 'jwt expired',
                        expiredAt: 1408621000
                      }
                    */
                   console.log(err);
                   message+=err.name;
                   console.log(decoded);

                   return decoded;
                }

            });
            console.log("verifyAccessToken",token);
            return {result:true,data:token?token:null,message:message};
    } catch (error) {
        console.log("ERROR VERIFY:"+error);
        return false
    }
}
const verifyRefreshToken = (verifiedToken) => {
    try {
        let message="";
        const token = jwt.verify(
            verifiedToken,
            process.env.REFRESH_TOKEN_SECRET, 
            function (err, decoded) {
                if (err) {
                    /*
                      err = {
                        name: 'TokenExpiredError',
                        message: 'jwt expired',
                        expiredAt: 1408621000
                      }
                    */
                   console.log(err.expiredAt,err.message);
                   message+=err.name
                   return decoded;
                }
            });
            return {result:true,data:token?token:null,message:message};
    } catch (error) {
        console.log("ERROR VERIFY:"+error);
        return {result:false,data:null,message:error.name}
    }
}
module.exports={verifyAccessToken,verifyRefreshToken,createAccessToken,createRefreshToken}