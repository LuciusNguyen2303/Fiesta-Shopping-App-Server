const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId
const verificationCode = new Schema({
    userId: { type: ObjectId, ref: "products" },
    verificationCode: { type: String }
})

module.exports=mongoose.models.verificationCode || mongoose.model("verificationCodes", verificationCode)