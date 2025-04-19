const Joi = require('joi');

// Đối với những hàm trung gian thì có thêm next dùng để next đến hàm tiếp theo
module.exports.createPost = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string()
            .required().messages({
                "string.empty": "Vui lòng tên danh mục!",
            }),
        parent: Joi.string().allow(""),
        position: Joi.string().allow(""),
        status: Joi.string().allow(""),
        avatar: Joi.string().allow(""),
        description: Joi.string().allow(""),
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