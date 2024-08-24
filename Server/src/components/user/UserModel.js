const mongoose = require('mongoose')
const Schema = mongoose.Schema
const addressSchema = new Schema({
    name: {type: String},
    phoneNumber: {type: String},
    country:{type: String, default: ""},
    city: {type: String, default: ""},
    district: {type: String, default: ""},
    ward: {type: String, default: ""},
    street: {type: String, default: ""},
    houseNumber: {type: String, default: ""},
    isDefault:{type:Boolean,default:false}
})
const userSchema = new Schema({
    name: { type: String },
    gender: { type: String,default:'Male' },
    phoneNumber: { type: String, default: "" },
    address: { type: [addressSchema], default: [] },
    userName: { type: String, unique: true },
    password: { type: String },
    image: {
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