const skip= require("../public method/page")
const totalPages = require("../public method/page")
const LIMIT = require("../public method/constant")
module.exports={
    ...skip,
    ...totalPages,
    ...LIMIT
}