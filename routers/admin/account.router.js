const router = require('express').Router();

const accountController = require("../../controllers/admin/account.controller");

const accountValidate = require("../../validates/admin/account.validate");

router.get('/login', accountController.login)

// Dùng để gửi dữ liệu đăng nhập ký lên server
router.post(
    '/login', 
    accountValidate.loginPost, // Kiểm tra dữ liệu đầu vào bên phía BE, hợp lệ rồi mới gửi lên csdl
    accountController.loginPost)

router.get('/register', accountController.register)

// Dùng để gửi dữ liệu đăng ký lên server
router.post(
    '/register', 
    accountValidate.registerPost, // Kiểm tra dữ liệu đầu vào bên phía BE, hợp lệ rồi mới gửi lên csdl
    accountController.registerPost)

router.get('/register-initial', accountController.registerInitial)

router.get('/forgot-password', accountController.forgotPassword)

router.get('/otp-password', accountController.otpPassword)

router.get('/reset-password', accountController.resetPassword)

router.post('/logout', accountController.logoutPost)

module.exports = router;