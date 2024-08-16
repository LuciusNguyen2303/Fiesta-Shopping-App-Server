const userModel = require('./UserModel')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const CustomError = require('../../HandleError')
const { IdTokenClient } = require('google-auth-library')
const LIMIT = require('../public method/constant')
const { createAccessToken, createRefreshToken, verifyRefreshToken } = require('../public method/jwtMethods')
const { uploadImage } = require('../public method/ImageMethod/ImageMethods')
const addUser = async (name, userName, password) => {
    try {
        const checkUser = await userModel.findOne({ userName: userName })
        console.log(checkUser);
        if (!checkUser) {
            const hashedPassword = await bcrypt.hash(password, 10)
            const newUser = { name: name, userName: userName, password: hashedPassword }
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
        const result = await userModel.findOne({ _id: id }).select("_id name gender phoneNumber address userName image")
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

const getRoleById = async (id) => {
    try {

        const check = await userModel.findById(id).select("role")
        console.log(JSON.stringify(check), "SERVICE GET ROLE");
        if (check)
            return check
        return false;
    } catch (error) {
        console.log("ERROR when find role by id: " + error);
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
        const check = await userModel.findOne({ _id: id }).select("role")
        if (!check)
            throw new CustomError("No available document!!!")
        if (check.role !== "Customer")
            throw new CustomError("This user must be the Customer!!!")

        const result = await userModel.updateOne({ _id: id }, { role: "GrantedPermissions" })
        return result;
    } catch (error) {
        console.log(`GrantedPermissions error (user's service):${error}`);
        return false
    }
}
const Authorized = async (id) => {
    try {
        const check = await userModel.findOne({ _id: id }).select("role")
        if (!check)
            throw new CustomError("No available document!!!")
        if (check.role !== "GrantedPermissions")
            throw new CustomError("This user must Granted Permissions first!!!")
        console.log(JSON.stringify(check));
        const result = await userModel.updateOne({ _id: id, role: "GrantedPermissions" }, { role: "Staff" })
        return result
    } catch (error) {
        console.log(`Authorized error (user's service):${error}`);
        return false
    }
}

const LockUser = async (id) => {
    try {
        const check = await userModel.findOne({ _id: id }).select("role");
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
        const check = await userModel.findOne({ _id: id }).select("role");
        if (check.role == "Admin")
            throw new CustomError("Can't delete the Admin.")
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
        console.log(`UndoUser error (user's service):${error}`);
        return false
    }
}
const UnlockUser = async (id) => {
    try {
        const result = await userModel.updateOne({ _id: id }, { isLock: false })
        return result;
    } catch (error) {
        console.log(`UndoUser error (user's service):${error}`);
        return false
    }
}
const updateUserInfo = async (id, updateFields) => {
    try {

        console.log(" updateUserInfo (service): " + JSON.stringify(updateFields));
        const result = await userModel.findByIdAndUpdate(id, updateFields, { new: true });
        return result

    } catch (error) {
        console.log("Error at updateUserInfo (service): " + error);
        return false;
    }
}
const changePassword = async (userName, currentPassword, newPassword) => {
    try {
        const isAvailableUser = await userModel.findOne({ userName: userName });
        let check = false
        if (isAvailableUser) {
            const isPasswordValid = await bcrypt.compare(currentPassword, isAvailableUser.password)
            if (!isPasswordValid) {
                throw new Error('Password is incorrect!')
            } else if (isPasswordValid) {
                const hashedPassword = await bcrypt.hash(newPassword, 10)
                isAvailableUser.password = hashedPassword
                return await isAvailableUser.save()
            }
        }
        return false;
    } catch (error) {
        console.log("Error at change password (service): " + error);
        return false;
    }
}
const addNewAddress = async (userId, addFields) => {
    try {
        const result = await userModel.findByIdAndUpdate(userId,
            {
                $push: {
                    address: {
                        city: addFields.city ? addFields.city : "",
                        district: addFields.district ? addFields.district : "",
                        ward: addFields.ward ? addFields.ward : "",
                        street: addFields.street ? addFields.street : "",
                        houseNumber: addFields.houseNumber ? addFields.houseNumber : ""
                    }
                },
            },
            {
                new: true
            }
        )
        if (result)
            return result
        return null
    } catch (error) {
        console.log('add new address error(Service): ' + error);

    }
}
const updateAddress = async (userId, updateFields, addressId) => {
    try {
        const result = await userModel.findByIdAndUpdate(userId,
            {
                $set: {
                    ...(updateFields.city ? { 'address.$[elem].city': updateFields.city } : {}),
                    ...(updateFields.district ? { 'address.$[elem].district': updateFields.district } : {}),
                    ...(updateFields.ward ? { 'address.$[elem].ward': updateFields.ward } : {}),
                    ...(updateFields.street ? { 'address.$[elem].street': updateFields.street } : {}),
                    ...(updateFields.houseNumber ? { 'address.$[elem].houseNumber': updateFields.houseNumber } : {})
                }
            },
            {
                new: true,
                arrayFilters: [{ 'elem._id': addressId }]
            }
        )
        if (result)
            return result
        return null
    } catch (error) {
        console.log('update address error(Service): ' + error);

    }
}
const deleteAddress = async (userId, addressId) => {
    try {
        const result = await userModel.findByIdAndUpdate(userId,
            {
                $pull: {
                    address: { _id: addressId }
                }
            },
            {
                new: true
            })
            if(result)
                return result
    } catch (error) {
        console.log("delete address error(Service): " + error);
        
    }
}
module.exports = {
    getUserbyId, UnlockUser, 
    changePassword, updateUserInfo, 
    getRoleById, checkRefreshToken, 
    UndoUser, DeleteUser, LockUser, 
    Authorized, GrantedPermissions, 
    addUser, signIn, addNewAddress, updateAddress, deleteAddress }