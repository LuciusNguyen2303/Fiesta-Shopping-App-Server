const userModel = require('./UserModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const CustomError = require('../../HandleError')
const { IdTokenClient } = require('google-auth-library')
const LIMIT = require('../public method/constant')
const { createAccessToken, createRefreshToken, verifyRefreshToken } = require('../public method/jwtMethods')
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
const getUserbyId = async (id) => {
    try {
        const result = await userModel.findOne({ _id: id }, { refreshToken: 0 })
        return result
    } catch (error) {
        console.log('addUser Error(Service): ' + error);
        return false;
    }
}
const getGrantedPermissionsbyPages = async () => {
    try {
        const result = await userModel.find({ role: "GrantedPermissions" }, { refreshToken: 0 }).limit(LIMIT).skip()
        return result
    } catch (error) {
        console.log('addUser Error(Service): ' + error);
        return false;
    }
}
const getLockUsersbyPages = async () => {
    try {
        const result = (await userModel.find({ role: "GrantedPermissions" }, { refreshToken: 0 })).limit(LIMIT)
        return result
    } catch (error) {
        console.log('addUser Error(Service): ' + error);
        return false;
    }
}
const getHiddenUsersbyPages = async () => {
    try {
        const result = (await userModel.find({ role: "GrantedPermissions" }, { refreshToken: 0 })).limit(LIMIT)
        return result
    } catch (error) {
        console.log('addUser Error(Service): ' + error);
        return false;
    }
}

const getRoleById = async (id)=>{
    try {
        
        const check = await userModel.findById(id).select("role")
        console.log(JSON.stringify(check),"SERVICE GET ROLE");
        if(check)
            return check
        return false;
    } catch (error) {
        console.log("ERROR when find role by id: " +error );
        return false;
    }
}
const checkRefreshToken = async (userField) => {
    try {
        let check = {};
        const user = await userModel.findById(userField._id).select("refreshToken");
        if (user.refreshToken) {
            const refreshToken = user.refreshToken
            check = verifyRefreshToken(refreshToken)

        }
        else
            return false
            console.log("SERVICEEEEEEEEEEEEfffffffffffffffff " + JSON.stringify(check));
        if (check.message.length > 0) {
            console.log("SERVICEEEEEEEEEEEE " + check.message);

            if (check.message == "TokenExpiredError") {
                refreshToken.refreshToken = ""
                console.log("TokenExpiredError at refreshToken");
                return !(await refreshToken.save())
            }
            console.log("Message refreshToken error: " + check.message);
            return false
        }
        return true;
    } catch (error) {
        console.log("ERROR when try to verify Refresh token: " + error);
        return false
    }
}
const signIn = async (userName, password) => {
    try {
        const user = await userModel.findOne({ userName: userName })
        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password)
            if (!isPasswordValid) {
                throw new Error('Password is incorrect!')
            }
        } else {
            console.log('Username doesnt exist!');
            return false;
        }
        const accessToken = createAccessToken(user);
        const refreshToken = createRefreshToken(user)
        user.refreshToken = refreshToken;
        const result = await user.save();
        console.log("ACCESS TOKEN: ", accessToken, "\nREFRESH TOKEN: ", refreshToken, "\n Does it save refreshToken?", refreshToken);

        if (result) {
            return accessToken
        }
        throw new CustomError("Error when saves the refreshToken!!! ", 500)
    } catch (error) {
        console.log('Login Error(Service): ' + error);
        return false;
    }
}

const GrantedPermissions = async (id) => {
    try {
        const result = await userModel.updateOne({ _id: id }, { role: "GrantedPermissions" })
        return result;
    } catch (error) {
        console.log(`GrantedPermissions error (user's service):${error}`);
        return false
    }
}
const Authorized = async (id) => {
    try {
        const result = await userModel.updateOne({ _id: id, role: "GrantedPermissions" }, { role: "Staff" })
    } catch (error) {
        console.log(`Authorized error (user's service):${error}`);
        return false
    }
}

const LockUser = async (id) => {
    try {
        const check = await userModel.findOne({ _id: id });
        if (check.role == "Admin")
            throw new CustomError("Can't lock the Admin.")
        const result = await userModel.updateOne({ _id: id }, { isLock: true })
        return result;
    } catch (error) {
        console.log(`Authorized error (user's service):${error}`);
        return false
    }
}
const DeleteUser = async (id) => {
    try {
        const result = await userModel.updateOne({ _id: id }, { isHidden: true })
        return result;
    } catch (error) {
        console.log(`DeleteUser error (user's service):${error}`);
        return false
    }
}
const UndoUser = async (id) => {
    try {
        const result = await userModel.updateOne({ _id: id }, { isHidden: false })
        return result;
    } catch (error) {
        console.log(`UndeleteUser error (user's service):${error}`);
        return false
    }
}
module.exports = { getRoleById,checkRefreshToken, UndoUser, DeleteUser, LockUser, Authorized, GrantedPermissions, addUser, signIn }