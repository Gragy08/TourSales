const router = require('express').Router();

const orderController = require("../../controllers/admin/order.controller");

router.get('/list', orderController.list)

router.get('/edit', orderController.edit)

// router.get('/trash', tourController.trash)

module.exports = router;