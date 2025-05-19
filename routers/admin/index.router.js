const router = require('express').Router();
const accountRouters = require("./account.router");
const dashboardRouters = require("./dashboard.router");
const categoryRouters = require("./category.router");
const tourRouters = require("./tour.router");
const orderRouters = require("./order.router");
const userRouters = require("./user.router");
const contactRouters = require("./contact.router");
const settingRouters = require("./setting.router");
const profileRouters = require("./profile.router");
const uploadRoutes = require("./upload.router");

const authMiddleware = require("../../middlewares/admin/auth.middleware");

// Khi đăng xuất ra bấm nút trở lại vẫn vào được trang tổng quan => do nó còn lưu trong bộ nhớ đệm của trình duyệt
router.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store')
    next();
})

//dùng use không dùng get để mấy router con lại không bị ảnh hưởng, các router còn con lại có thể sử dụng get, post, put, delete
router.use('/account', accountRouters)

// Sử dụng middleware authMiddleware.verifyToken để xác thực token trước khi vào các router khác
// Chạy vào authMiddleware.verifyToken trước rồi mới chạy vào các router khác
router.use('/dashboard', authMiddleware.verifyToken, dashboardRouters)

router.use('/category', authMiddleware.verifyToken, categoryRouters)

router.use('/tour', authMiddleware.verifyToken, tourRouters)

router.use('/order', authMiddleware.verifyToken, orderRouters)

router.use('/user', authMiddleware.verifyToken, userRouters)

router.use('/contact', authMiddleware.verifyToken, contactRouters)

router.use('/setting', authMiddleware.verifyToken, settingRouters)

router.use('/profile', authMiddleware.verifyToken, profileRouters)

router.use('/upload', authMiddleware.verifyToken, uploadRoutes)

router.get('*', authMiddleware.verifyToken, (req, res) => {
    res.render("admin/pages/error-404", {
        pageTitle: "404 Not Found"
    })
})

module.exports = router;
