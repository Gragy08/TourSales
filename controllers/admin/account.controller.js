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