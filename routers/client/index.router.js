const router = require('express').Router();
const homeRouters = require("./home.router");
const tourRouters = require("./tour.router");
const cartRouters = require("./cart.router");
const contactRouters =  require("./contact.router");
const categoryRouters = require("./category.router");
const searchRoutes = require("./search.router");

const settingMiddleware = require("../../middlewares/client/setting.middleware");
const categoryMiddleware = require("../../middlewares/client/category.middleware");

// tất cả các route ở client đều đi qua hàm websiteInfo, categoryList
router.use(settingMiddleware.websiteInfo);
router.use(categoryMiddleware.categoryList);

// dùng use không dùng get để mấy router con lại không bị ảnh hưởng, các router còn con lại có thể sử dụng get, post, put, delete
router.use('/', homeRouters)
router.use('/tours', tourRouters)
router.use('/cart', cartRouters)
router.use('/contact', contactRouters)
router.use('/category', categoryRouters)
router.use('/search', searchRoutes)

module.exports = router;
