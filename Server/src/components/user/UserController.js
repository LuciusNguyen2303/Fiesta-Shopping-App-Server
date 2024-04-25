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
        return await userService.signIn(userName, password)
    } catch (error) {
        console.log('Login Error(Controller): ' + error);
    }
}
module.exports = { addUser, signIn }