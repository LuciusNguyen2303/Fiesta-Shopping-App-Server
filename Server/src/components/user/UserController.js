const CustomError = require('../../HandleError');
const userService = require('./UserService')
const addUser = async (name, userName, password, gender) => {
    try {
        return await userService.addUser(name, userName, password, gender)
    } catch (error) {
        console.log('addUser Error(Controller): ' + error);
    }
}
const signIn = async (userName, password) => {
    try {
        if(!userName)
            throw new CustomError("No username!!",500);
        if(!password)
            throw new CustomError("No password!!",500);
        return await userService.signIn(userName, password)
    } catch (error) {
        console.log('Login Error(Controller): ' + error);
    }
}
const GrantedPermissions = async (id) => {
    try {
        if(!id)
            throw new CustomError("No username!!",500);
        return await userService.GrantedPermissions(id)
    } catch (error) {
        console.log('Login Error(Controller): ' + error);
    }
}
const Authorized = async (id) => {
    try {
        if(!id)
            throw new CustomError("No username!!",500);
        return await userService.Authorized(id)
    } catch (error) {
        console.log('Login Error(Controller): ' + error);
    }
}
const LockUser = async (id) => {
    try {
        if(!id)
            throw new CustomError("No username!!",500);
        return await userService.LockUser(id)
    } catch (error) {
        console.log('Login Error(Controller): ' + error);
    }
}
const DeleteUser = async (id) => {
    try {
        if(!id)
            throw new CustomError("No username!!",500);
        return await userService.DeleteUser(id)
    } catch (error) {
        console.log('Login Error(Controller): ' + error);
    }
}
const UndoUser = async (id) => {
    try {
        if(!id)
            throw new CustomError("No username!!",500);
        return await userService.UndoUser(id)
    } catch (error) {
        console.log('Login Error(Controller): ' + error);
    }
}
module.exports = { UndoUser,DeleteUser,LockUser, Authorized,GrantedPermissions,addUser, signIn }