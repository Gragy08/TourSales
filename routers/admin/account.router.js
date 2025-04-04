const router = require('express').Router();

const accountController = require("../../controllers/admin/account.controller");

router.get('/login', accountController.login)

router.get('/register', accountController.register)

// Dùng để gửi dữ liệu đăng ký lên server
router.post('/register', accountController.registerPost)

router.get('/register-initial', accountController.registerInitial)

router.get('/forgot-password', accountController.forgotPassword)

router.get('/otp-password', accountController.otpPassword)

router.get('/reset-password', accountController.resetPassword)

module.exports = router;