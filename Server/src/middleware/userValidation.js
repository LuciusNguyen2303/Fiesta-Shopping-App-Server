const addUser_Validation = async (req, res, next) => {
    const { name, userName, password, gender } = req.body;

    // Kiểm tra nếu bất kỳ trường thông tin nào bị thiếu
    if (!name || !userName || !password || !gender) {
        return res.status(400).json({
            result: false,
            message: 'Thiếu thông tin người dùng!'
        });
    }

    // Kiểm tra mật khẩu phải có ít nhất 8 ký tự
    if (password.length < 9) {
        return res.status(400).json({
            result: false,
            message: 'Mật khẩu phải chứa ít nhất 8 ký tự!'
        });
    }

    if (name.length > 15) {
        return res.status(400).json({
            result: false,
            message: 'Tên người dùng tối đa 15 kí tự'
        });
    }

    // Kiểm tra mật khẩu phải chứa ít nhất một chữ cái và một chữ số
    if (!(/[a-zA-Z]/.test(password) && /\d/.test(password))) {
        return res.status(400).json({
            result: false,
            message: 'Mật khẩu phải chứa ít nhất một chữ cái và một chữ số!'
        });
    }

    // Kiểm tra tên người dùng không được chứa ký tự đặc biệt
    if (/[^a-zA-Z0-9]/.test(userName)) {
        return res.status(400).json({
            result: false,
            message: 'Tên đang nhập không được chứa ký tự đặc biệt!'
        });
    }

    if (/[^a-zA-Z0-9 ]/.test(name)) {
        return res.status(400).json({
            result: false,
            message: 'Tên người dùng không được chứa ký tự đặc biệt!'
        });
    }

    // Tiếp tục nếu không có lỗi
    next();
}
module.exports = { addUser_Validation }