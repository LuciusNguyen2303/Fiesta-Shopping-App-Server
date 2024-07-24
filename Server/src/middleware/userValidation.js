const addUser_Validation = async (req, res, next) => {
    const { name, userName, password } = req.body;
    try {
       

        // Kiểm tra nếu bất kỳ trường thông tin nào bị thiếu
        if (!name || !userName || !password) {
            return res.status(400).json({
                result: false,
                message: 'Thiếu thông tin người dùng!'
            });
        }
        var validemailRegex = new RegExp("^[\\w\\.-]+@[a-zA-Z\\d\\.-]+\\.[a-zA-Z]{2,6}$")
        if (!validemailRegex.test(userName)) {
            return res.status(400).json({
                result: false,
                message: 'Email không hợp lệ!'
            });
        }

        // Kiểm tra mật khẩu phải có ít nhất 8 ký tự
        if (password.length < 9) {
            return res.status(400).json({
                result: false,
                message: 'Mật khẩu phải chứa ít nhất 8 ký tự!'
            });
        }
        console.log(name.length, userName, password.length);


        if (!name.length > 6) {
            return res.status(400).json({
                result: false,
                message: 'Tên người dùng tối đa 6 kí tự'
            });
        }
        const validPassword = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$')
        // Kiểm tra mật khẩu phải chứa ít nhất một chữ cái và một chữ số
        if (!validPassword.test(password)) {
            return res.status(400).json({
                result: false,
                message: 'Mật khẩu phải chứa ít nhất một chữ cái và một chữ số!'
            });
        }
 

        // Kiểm tra tên người dùng không được chứa ký tự đặc biệt

        if (/[^a-zA-Z0-9 ]/.test(name)) {
            return res.status(400).json({
                result: false,
                message: 'Tên người dùng không được chứa ký tự đặc biệt!'
            });
        }
        // Tiếp tục nếu không có lỗi
        next();
    } catch (error) {
        console.log("Add user validation: "+error);
        return res.status(500).json({
            result: false,
            message: error
        });
    }
}
module.exports = { addUser_Validation }