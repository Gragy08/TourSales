const jwt = require('jsonwebtoken');
const AccountAdmin = require('../../models/account-admin.model');

// Nơi các hàm trung gian

module.exports.verifyToken = async (req, res, next) => {
    try {
        // Lấy token từ cookie
        const token = req.cookies.token;
        console.log(token);

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
        console.log(existAccount);

        if(!existAccount) {
            res.clearCookie("token");
            res.redirect(`/${pathAdmin}/account/login`);
            return;
        }

        // Account existed
        // Add to object req variable: account
        req.account = existAccount;

        // Generate User's Info into interface
        // Use local in files PUG, variable: account
        res.locals.account = existAccount;

        next();
    } catch (error) {
        res.clearCookie("token");
        res.redirect(`/${pathAdmin}/account/login`);
    }
}