const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema({
    name: {type: String},
    gender: {type: String},
    phoneNumber: {type: String, default: ""},
    address: {type: String, default: ""},
    userName: {type: String},
    password: {type: String},
    avatar: {type: String, default: ""}
})
module.exports = mongoose.models.users || mongoose.model('users', userSchema)