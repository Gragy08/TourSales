const AccountAdmin = require("../../models/account-admin.model")
// Nhúng thư viện bcrypts vào
const bcryptjs = require("bcryptjs")
const jwt = require('jsonwebtoken')

module.exports.login = async (req, res) => {
    //Khi chạy vào hàm này sẽ render ra file login.pug trong thư mục views/admin/pages
    //Và truyền vào biến title là "Đăng nhập"
    res.render("admin/pages/login", {
        pageTitle: "Đăng nhập"
    })
}

module.exports.loginPost = async (req, res) => {
    // Ở hàm này chúng ta sẽ nhận đưọc dâta từ form đăng ký gửi lên, lấy data thông qua body
    // Do dùng .json để cho phép gửi dữ liệu lên backend ở file index.js tổng rồi thì dữ liệu nhận ở đây đã được chuyển từ json sang js rồi
    // Phá vỡ cấu trúc để có các biến dùng cho tiện
    const { email, password, rememberPassword } = req.body;

    const existAccount = await AccountAdmin.findOne({
        email: email
    });

    if(!existAccount) {
        res.json({
            code: "error",
            message: "Email không tồn tại!"
        });
        return;
    }

    // Nếu tài khoản đã tồn tại thì kiểm tra mật khẩu
    // Mật khẩu được mã hóa nên không thể so sánh trực tiếp với mật khẩu đã nhập vào được
    // Sử dụng hàm compare của bcryptjs để so sánh mật khẩu đã nhập vào với mật khẩu trong csdl
    const isPasswordValid = await bcryptjs.compare(password, existAccount.password);
    if(!isPasswordValid) {
        res.json({
            code: "error",
            message: "Mật khẩu không đúng!"
        });
        return;
    }

    if(existAccount.status != "active") {
        res.json({
            code: "error",
            message: "Tài khoản chưa được kích hoạt!"
        });
        return;
    }

    // Create JWT
    // Nếu tài khoản đã tồn tại và mật khẩu đúng thì tạo token cho tài khoản
    // Token này sẽ được gửi về cho client để lưu lại trong cookie, mỗi lần gửi request lên server thì kèm theo token này để xác thực tài khoản
    const token = jwt.sign(
        {
            id: existAccount.id,
            email: existAccount.email
        },
        // Tham số thứ 2 là một chuỗi bảo mật, nó sẽ mã hóa thông tin trong token theo chuỗi bảo mật này
        // Lưu vào env
        process.env.JWT_SECRET,
        {
            // Tham số thứ 3 là thời gian sống của token, sau thời gian này thì token sẽ không còn hiệu lực nữa
            expiresIn: rememberPassword ? '30d' : '1d' // 1 ngày
        }
    )

    // Lưu token vào cookie, mỗi lần gửi request lên server thì kèm theo token này để xác thực tài khoản
    // Lưu trong cookie có ưu điểm là cả bên BE và FE đều lấy được
    res.cookie("token", token, {
        maxAge: rememberPassword ? (30 * 24 * 60 * 60 * 1000) : (24 * 60 * 60 * 1000), // Thời gian sống của cookie là 1 ngày theo mili giây hoặc 30 ngày nếu có rememberPassword
        httpOnly: true, // Chỉ cho phép truy cập cookie từ server, không cho phép truy cập từ client (bảo mật hơn)
        sameSite: "strict" // Chỉ cho phép gửi cookie từ cùng một trang web, không cho phép gửi cookie từ trang web khác (bảo mật hơn)
    })

    // Sau khi lấy được data thì phản hồi lại cho front-end chuỗi JSON
    res.json({
        code: "success",
        message: "Đăng nhập thành công!" 
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

    // Mã hóa mật khẩu trước khi đưa vào csdl với thư viện bcryptjs
    const salt = await bcryptjs.genSalt(10); // Tạo ra chuỗi ngẫu nhiên có 10 ký tự
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Nếu chưa tồn tại thì tạo mới tài khoản
    const newAccount = new AccountAdmin({
        fullName: fullName,
        email: email,
        password: hashedPassword,
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

module.exports.logoutPost = async (req, res) => {
    // Xóa token trong cookie đi
    res.clearCookie("token");
    res.json({
        code: "success",
        message: "Đăng xuất thành công!"
    })
}
