const userModel = require('./UserModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
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
    } catch (error) {
        console.log('addUser Error(Service): ' + error);
    }
}
const signIn = async (userName, password) => {
    try {
        const finduser = await userModel.findOne({ userName: userName })
        if (finduser) {
            const isPasswordValid = await bcrypt.compare(password, finduser.password)
            if (!isPasswordValid) {
                console.log('Password is incorrect!');
                return false;
            }
        } else {
            console.log('Username doesnt exists!');
            return false
        }
        const token = jwt.sign(
            { userId: finduser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2m' });
        const refreshToken = jwt.sign(
            { userId: finduser._id }, process.env.ACCESS_REFRESH_TOKEN_SECRET, { expiresIn: '2d' });
        return {
            token,
            refreshToken,
            user: {
                userName: finduser.userName,
                name: finduser.name,
                gender: finduser.gender,
                address: finduser.address, 
                phoneNumber: finduser.phoneNumber,
                avatar: finduser.avatar
            }
        };
    } catch (error) {
        console.log('Login Error(Service): ' + error);
    }
}
module.exports = { addUser, signIn }