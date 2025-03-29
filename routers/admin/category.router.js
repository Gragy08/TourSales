const router = require('express').Router();

const categoryController = require("../../controllers/admin/category.controller");

router.get('/list', categoryController.list)

module.exports = router;