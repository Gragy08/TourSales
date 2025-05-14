const router = require('express').Router();
const homeRouters = require("./home.router");
const tourRouters = require("./tour.router");
const cartRouters = require("./cart.router");

const settingMiddleware = require("../../middlewares/client/setting.middleware");

// tất cả các route ở client đều đi qua hàm websiteInfo
router.use(settingMiddleware.websiteInfo);

// dùng use không dùng get để mấy router con lại không bị ảnh hưởng, các router còn con lại có thể sử dụng get, post, put, delete
router.use('/', homeRouters)
router.use('/tours', tourRouters)
router.use('/cart', cartRouters)

module.exports = router;
