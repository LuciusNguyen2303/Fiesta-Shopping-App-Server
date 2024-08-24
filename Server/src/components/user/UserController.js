const CustomError = require('../../HandleError');
const { CustomerUpdateFields, cleanObject } = require('../public method');
const userService = require('./UserService')
const addUser = async (name, userName, password) => {
    try {
        return await userService.addUser(name, userName, password)
    } catch (error) {
        console.log('addUser Error(Controller): ' + error);
    }
}
const signIn = async (userName, password) => {
    try {
        if (!userName)
            throw new CustomError("No username!!", 500);
        if (!password)
            throw new CustomError("No password!!", 500);
        return await userService.signIn(userName, password)
    } catch (error) {
        console.log('Login Error(Controller): ' + error);
    }
}
const checkRefreshToken = async (user) => {
    try {
        if (Object.keys(user).length <= 0)
            throw new CustomError("No userInfo!!", 500);
        return await userService.checkRefreshToken(user)
    } catch (error) {
        console.log('Login Error(Controller): ' + error);
    }
}
const getUserbyId = async (id) => {
    try {
        if (!id)
            throw new CustomError("No id user!!", 500);
        return await userService.getUserbyId(id)
    } catch (error) {
        console.log('Login Error(Controller): ' + error);
    }
}
const getRoleById = async (id) => {
    try {
        if (!id)
            throw new CustomError("No id user!!", 500);
        return await userService.getRoleById(id)
    } catch (error) {
        console.log('Login Error(Controller): ' + error);
    }
}
const GrantedPermissions = async (id) => {
    try {
        if (!id)
            throw new CustomError("No id!!", 500);
        return await userService.GrantedPermissions(id)
    } catch (error) {
        console.log('Login Error(Controller): ' + error);
    }
}
const Authorized = async (id) => {
    try {
        if (!id)
            throw new CustomError("No id!!", 500);
        return await userService.Authorized(id)
    } catch (error) {
        console.log('Login Error(Controller): ' + error);
    }
}
const LockUser = async (id) => {
    try {
        if (!id)
            throw new CustomError("No id!!", 500);
        return await userService.LockUser(id)
    } catch (error) {
        console.log('Login Error(Controller): ' + error);
    }
}
const DeleteUser = async (id) => {
    try {
        if (!id)
            throw new CustomError("No id!!", 500);
        return await userService.DeleteUser(id)
    } catch (error) {
        console.log('Login Error(Controller): ' + error);
    }
}
const UndoUser = async (id) => {
    try {
        if (!id)
            throw new CustomError("No id!!", 500);
        return await userService.UndoUser(id)
    } catch (error) {
        console.log('Login Error(Controller): ' + error);
    }
}
const UnlockUser = async (id) => {
    try {
        if (!id)
            throw new CustomError("No id!!", 500);
        return await userService.UnlockUser(id)
    } catch (error) {
        console.log('Login Error(Controller): ' + error);
    }
}

const updateUserInfo = async (id, updateFields) => {
    try {
        if (!id)
            throw new CustomError("No id to update the user's info!!!!")
        if (!updateFields)
            throw new CustomError("No updateFields to update the user's info!!!!")

        return await userService.updateUserInfo(id, cleanObject(updateFields, CustomerUpdateFields));


    } catch (error) {
        console.log("Error at updateUserInfo (CONTROLLER): " + error);
        return false;
    }
}
const changePassword = async (userName, currentPassword, newPassword) => {
    try {
        if (!userName)
            throw new CustomError("No userName to change the user's password!!!!")
        if (!currentPassword)
            throw new CustomError("No currentPassword to change the user's password!!!!")
        if (!newPassword)
            throw new CustomError("No newPassword to change the user's password!!!!")

        return await userService.changePassword(userName, currentPassword, newPassword);
    } catch (error) {
        console.log("Error at change password (CONTROLLER): " + error);
        return false;
    }
}
const addNewAddress = async (userId, addFields) => {
    try {
        console.log(addFields);

        if (!userId)
            throw new CustomError("Not found userId!!!")
        if (!addFields || !addFields.city  || !addFields.ward || !addFields.street || !addFields.name || !addFields.phoneNumber)
            throw new CustomError("Not valid addFields!!!")
        return await userService.addNewAddress(userId, addFields)
    } catch (error) {
        console.log("Error at add new address (Controller): " + error);
        return false;
    }
}
const updateAddress = async (userId, updateFields, addressId) => {
    try {
        if (!userId)
            throw new CustomError("Not found userId!!!")
        if (!updateFields)
            throw new CustomError("Not valid updateFields!!!")
        if (!addressId)
            throw new CustomError("Not found updateFields!!!")
        return await userService.updateAddress(userId, updateFields, addressId)
    } catch (error) {
        console.log("Error at update address (Controller): " + error);
        return false;
    }
}
const deleteAddress = async (userId, addressId) => {
    try {
        if (!userId)
            throw new CustomError("Not found userId!!!")
        if (!addressId)
            throw new CustomError("Not found addressId!!!")
        return await userService.deleteAddress(userId, addressId)
    } catch (error) {
        console.log("Error at delete address (Controller): " + error);
        return false;
    }
}
const setDefaultAddress = async (userId, addressId) => {
    try {
        if (!userId)
            throw new CustomError("Not found userId!!!")
        if (!addressId)
            throw new CustomError("Not found addressId!!!")
        return await userService.setDefaultAddress(userId, addressId)
    } catch (error) {
        console.log("Error at delete address (Controller): " + error);
        return false;
    }
}
module.exports = {
    getUserbyId, UnlockUser,
    changePassword, updateUserInfo,
    getRoleById, checkRefreshToken,
    UndoUser, DeleteUser, LockUser, 
    Authorized, GrantedPermissions,setDefaultAddress,
     addUser, signIn, addNewAddress, updateAddress, deleteAddress
}