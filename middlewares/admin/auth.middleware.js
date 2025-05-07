const jwt = require('jsonwebtoken');
const AccountAdmin = require('../../models/account-admin.model');
const Role = require('../../models/role.model');

// Nơi các hàm trung gian

module.exports.verifyToken = async (req, res, next) => {
    try {
        // Lấy token từ cookie
        const token = req.cookies.token;

        if(!token) {
            res.redirect(`/${pathAdmin}/account/login`);
            return;
        }

        // Kiểm tra xem token có hợp lệ hay không
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const { id, email } = decode;

        const existAccount = await AccountAdmin.findOne({
            _id: id,
            email: email,
            status: "active"
        })

        if(!existAccount) {
            res.clearCookie("token");
            res.redirect(`/${pathAdmin}/account/login`);
            return;
        }

        const role = await Role.findOne({
            _id: existAccount.role
        })

        existAccount.roleName = role.name;

        // Account existed
        // Add to object req variable: account
        req.account = existAccount;

        // Generate User's Info into interface
        // Use local in files PUG, variable: account
        res.locals.account = existAccount;

        // Tất cả các trang chạy qua file middleware này đều có mảng permissions
        res.locals.permissions = role.permissions;

        next();
    } catch (error) {
        res.clearCookie("token");
        res.redirect(`/${pathAdmin}/account/login`);
    }
}