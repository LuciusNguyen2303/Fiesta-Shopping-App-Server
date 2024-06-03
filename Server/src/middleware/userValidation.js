const addUser_Validation = async (req, res, next) => {
    const { name, userName, password, gender } = req.body;
    try {


        // Kiểm tra nếu bất kỳ trường thông tin nào bị thiếu
        if (!name || !userName || !password || !gender) {
            return res.status(400).json({
                result: false,
                message: 'Thiếu thông tin người dùng!'
            });
        }
        var validemailRegex = new RegExp("^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
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