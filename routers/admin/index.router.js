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

//dùng use không dùng get để mấy router con lại không bị ảnh hưởng, các router còn con lại có thể sử dụng get, post, put, delete
router.use('/account', accountRouters)

router.use('/dashboard', dashboardRouters)

router.use('/category', categoryRouters)

router.use('/tour', tourRouters)

router.use('/order', orderRouters)

router.use('/user', userRouters)

router.use('/contact', contactRouters)

router.use('/setting', settingRouters)

router.use('/profile', profileRouters)

module.exports = router;
