const router = require('express').Router();
const accountRouters = require("./account.router");

//dùng use không dùng get để mấy router con lại không bị ảnh hưởng, các router còn con lại có thể sử dụng get, post, put, delete
router.use('/account', accountRouters)

module.exports = router;
