const AccountAdmin = require("../../models/account-admin.model")

module.exports.login = async (req, res) => {
    //Khi chạy vào hàm này sẽ render ra file login.pug trong thư mục views/admin/pages
    //Và truyền vào biến title là "Đăng nhập"
    res.render("admin/pages/login", {
        pageTitle: "Đăng nhập"
    })
}

module.exports.register = async (req, res) => {
    res.render("admin/pages/register", {
        pageTitle: "Đăng ký"
    })
}

module.exports.registerPost = async (req, res) => {
    // Ở hàm này chúng ta sẽ nhận đưọc dâta từ form đăng ký gửi lên, lấy data thông qua body
    // Do dùng .json để cho phép gửi dữ liệu lên backend ở file index.js tổng rồi thì dữ liệu nhận ở đây đã được chuyển từ json sang js rồi
    // Phá vỡ cấu trúc để có các biến dùng cho tiện
    const { fullName, email, password } = req.body;

    // Tìm xem email đã tồn tại chưa
    const existAccount = await AccountAdmin.findOne({
        email: email
    });

    if(existAccount) {
        res.json({
            code: "error",
            message: "Email đã tồn tại!"
        });
        return;
    }

    // Nếu chưa tồn tại thì tạo mới tài khoản
    const newAccount = new AccountAdmin({
        fullName: fullName,
        email: email,
        password: password,
        status: "initial"
    });

    // Lưu tài khoản vào csdl
    await newAccount.save();

    // Sau khi lấy được data thì phản hồi lại cho front-end chuỗi JSON
    res.json({
        code: "success",
        message: "Đăng ký thành công!" 
    })
}

module.exports.forgotPassword = async (req, res) => {
    res.render("admin/pages/forgot-password", {
        pageTitle: "Quên mật khẩu"
    })
}

module.exports.otpPassword = async (req, res) => {
    res.render("admin/pages/otp-password", {
        pageTitle: "Mã xác thực"
    })
}

module.exports.resetPassword = async (req, res) => {
    res.render("admin/pages/reset-password", {
        pageTitle: "Đặt lại mật khẩu"
    })
}

module.exports.registerInitial = async (req, res) => {
    res.render("admin/pages/register-initial", {
        pageTitle: "Tài khoản đã được khởi tạo"
    })
}