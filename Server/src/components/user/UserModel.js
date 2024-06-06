const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema({
    name: { type: String },
    gender: { type: String },
    phoneNumber: { type: String, default: "" },
    address: { type: String, default: "" },
    userName: { type: String, unique: true },
    password: { type: String },
    avatar: {
        id: { type: String },
        url: { type: String }
    },
    isLock: { type: Boolean, default: false },
    isHidden: { type: Boolean, default: false },
    refreshToken: { type: String, default: "", index: true },
    role: { type: String, default: 'Customer', index: true, enum: ['Admin', 'Customer', "Staff", "GrantedPermissions"] }
})
/*
   role: 
   1- Admin - Shop Owner
   3- Customer
       
*/

module.exports = mongoose.models.users || mongoose.model('users', userSchema)