const router = require('express').Router();

const settingController = require("../../controllers/admin/setting.controller");

router.get('/list', settingController.list)

router.get('/website-info', settingController.websiteInfo)

// router.get('/trash', tourController.trash)

module.exports = router;