

const jwt = require('jsonwebtoken');
const { getRoleById } = require('../components/user/UserController');
const AuthorizedForAdmin = async (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        const user = jwt.decode(token);
        const check = await getRoleById(user._id)
        // console.log(user);

        if (check.role == "Admin")
                return next();

        return res.status(400).json({ result: false, statusCode: 400, message: "Must be the Admin to use this function!!!" })
    } catch (error) {
        console.log("ERROR AUTHORIZED FOR ADMIN: " + error);
        return res.status(400).json({ result: false, statusCode: 400, message: "Must be the Admin to use this function!!!" })

    }
}

const AuthorizedForStaff = async (req, res, next) => {
    const token = req.headers['authorization'].split(' ')[1];
    const user = jwt.decode(token);
    const check = await getRoleById(user._id)
    if (check.role == "Staff")
        return next();
    return res.status(400).json({ result: false, statusCode: 400, message: "Must be the Staff to use this function!!!" })
}

const AuthorizedForCustomer = async (req, res, next) => {
    const token = req.headers['authorization'].split(' ')[1];

    const user = jwt.decode(token);
    const check = await getRoleById(user._id)
    if (check.role == "Customer" || check.role == "GrantedPermissions")
       return next();
    console.log(check.role);
    
    return res.status(400).json({ result: false, statusCode: 400, message: "Must be the Admin to use this function!!!" })
}

module.exports = { AuthorizedForAdmin, AuthorizedForStaff,AuthorizedForCustomer }