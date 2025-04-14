const Joi = require('joi');

// Đối với những hàm trung gian thì có thêm next dùng để next đến hàm tiếp theo
module.exports.registerPost = (req, res, next) => {
    const schema = Joi.object({
        fullName: Joi.string()
            .required() // Kiểm tra bắt buộc input
            .min(5)
            .max(50)
            .messages({
                // Chỉ có bắt lỗi required là . vào empty thôi
                "string.empty": "Vui lòng nhập họ tên!",
                // Bắt lỗi min thì . vô min
                "string.min": "Họ tên phải có ít nhất 5 ký tự!",
                "string.max": "Họ tên không được vượt quá 50 ký tự!",
            }),
        email: Joi.string()
            .required()
            .email() // Kiểm tra định dạng email
            .messages({
                "string.empty": "Vui lòng nhập email!",
                "string.email": "Email không đúng định dạng!",
            }),
        password: Joi.string()
            .required()
            .min(8)
            .custom((value, helpers) => {
                if(!/[A-Z]/.test(value)) {
                    // Nếu không có chữ cái in hoa thì trả về lỗi
                    return helpers.error('password.uppercase');
                }
                if(!/[a-z]/.test(value)) {
                    // Nếu không có chữ cái viết thường thì trả về lỗi
                    return helpers.error('password.lowercase');
                }
                if(!/\d/.test(value)) {
                    // Nếu không có số thì trả về lỗi
                    return helpers.error('password.number');
                }
                if(!/[@$!%*?&]/.test(value)) {
                    // Nếu không có ký tự đặc biệt thì trả về lỗi
                    return helpers.error('password.special');
                }

                return value; // Nếu tất cả các điều kiện đều đúng thì trả về giá trị của password
            })
            .messages({
                "string.empty": "Vui lòng nhập mật khẩu !",
                "string.min": "Mật khẩu phải chứa ít nhất 8 ký tự!",
                "password.uppercase": "Mật khẩu phải chứa ít nhất một chữ cái in hoa!",
                "password.lowercase": "Mật khẩu phải chứa ít nhất một chữ cái thường!",
                "password.number": "Mật khẩu phải chứa ít nhất một chữ số!",
                "password.special": "Mật khẩu phải chứa ít nhất một ký tự đặc biệt!",
            }),
    });

    const { error } = schema.validate(req.body);

    if(error) {
        const errorMessage = error.details[0].message; // Lấy ra thông báo lỗi đầu tiên
        res.json({
            code: "error",
            message: errorMessage
        });
        return;
    }

    // Chuyển tới hàm tiếp theo (là hàm add data vào database)
    next();
}