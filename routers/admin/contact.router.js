const router = require('express').Router();

const contactController = require("../../controllers/admin/contact.controller");

router.get('/list', contactController.list)

router.get('/trash', contactController.trash)

router.patch('/delete/:id', contactController.deletePatch)

module.exports = router;