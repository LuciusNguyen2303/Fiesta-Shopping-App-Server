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
        const user = await userModel.findOne({ userName: userName })
        const userID = user._id.toString();
        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password)
            if (!isPasswordValid) {
                throw new Error('Password is incorrect!')
            }
        } else {
            console.log('Username doesnt exist!');
        }
        const token = jwt.sign(
            {
                id: userID,
                userName: userName,
                password: password
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '2m' });
        return token;
    } catch (error) {
        console.log('Login Error(Service): ' + error);
    }
}
module.exports = { addUser, signIn }