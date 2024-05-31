const userModel = require('./UserModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const CustomError = require('../../HandleError')
const { IdTokenClient } = require('google-auth-library')
require('dotenv').config()
const addUser = async (name, userName, password, gender) => {
    try {
        const checkUser = await userModel.findOne({ userName: userName })
        if (!checkUser) {
            const hashedPassword = await bcrypt.hash(password, 10)
            const newUser = { name: name, userName: userName, password: hashedPassword, gender: gender }
            console.log('addUser data: ' + JSON.stringify(newUser))
            const newU = new userModel(newUser)
            return await newU.save()
        }
        throw new CustomError("Already Existed your username. Try another username")
    } catch (error) {
        console.log('addUser Error(Service): ' + error);
        return false;
    }
}
const signIn = async (userName, password) => {
    try {
        const user = await userModel.findOne({ userName: userName })
        const userID = user._id.toString();
        const role= user.role;
        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password)
            if (!isPasswordValid) {
                throw new Error('Password is incorrect!')
            }
        } else {
            console.log('Username doesnt exist!');
            return false;
        }
        const token = jwt.sign(
            {
                id: userID,
                userName: userName,
                role:role
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '2m' });
        return token;
    } catch (error) {
        console.log('Login Error(Service): ' + error);
    }
}

 const GrantedPermissions = async(id)=>{
    try {
        const result= userModel.updateOne({_id:id},{role:"GrantedPermissions"})
        return result;
    } catch (error) {
        console.log(`GrantedPermissions error (user's service):${error}`);
        return false
    }
 }
 const Authorized = async(id)=>{
    try {
        const result= await userModel.updateOne({_id:id,role:"GrantedPermissions"},{role:"Staff"})
    } catch (error) {
        console.log(`Authorized error (user's service):${error}`);
        return false
    }
 }

 const LockUser = async (id)=>{
    try {
        const check= await userModel.findOne({_id:id});
        if(check.role=="Admin")
            throw new CustomError("Can't lock the Admin.")
        const result= await userModel.updateOne({_id:id},{isLock:true})
        return result;
    } catch (error) {
        console.log(`Authorized error (user's service):${error}`);
        return false
    }
 }
 const DeleteUser = async (id)=>{
    try {
        const result= await userModel.updateOne({_id:id},{isHidden:true})
        return result;
    } catch (error) {
        console.log(`DeleteUser error (user's service):${error}`);
        return false
    }
 }
 const UndoUser = async(id)=>{
    try {
        const result= await userModel.updateOne({_id:id},{isHidden:false})
        return result;
    } catch (error) {
        console.log(`UndeleteUser error (user's service):${error}`);
        return false
    }
 } 
module.exports = {UndoUser,DeleteUser,LockUser, Authorized,GrantedPermissions,addUser, signIn }