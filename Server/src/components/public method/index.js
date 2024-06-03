const skip= require("../public method/page")
const totalPages = require("../public method/page")
const LIMIT = require("../public method/constant")
const verifyAccessToken=require("./jwtMethods")
const verifyRefreshToken=require("./jwtMethods")
const createAccessToken=require("./jwtMethods")
const createRefreshToken=require("./jwtMethods")

module.exports={
    ...skip,
    ...totalPages,
    ...LIMIT,
    ...verifyAccessToken,
    ...verifyRefreshToken,
    ...createAccessToken,
    ...createRefreshToken,
}