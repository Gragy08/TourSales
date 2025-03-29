const router = require('express').Router();

const tourController = require("../../controllers/admin/tour.controller");

router.get('/list', tourController.list)

router.get('/create', tourController.create)

module.exports = router;