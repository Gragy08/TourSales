const router = require('express').Router();

const userController = require("../../controllers/admin/user.controller");

router.get('/list', userController.list)

// router.get('/create', tourController.create)

// router.get('/trash', tourController.trash)

module.exports = router;