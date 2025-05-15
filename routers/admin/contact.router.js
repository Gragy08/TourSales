const router = require('express').Router();

const contactController = require("../../controllers/admin/contact.controller");

router.get('/list', contactController.list)

router.get('/trash', contactController.trash)

router.patch('/delete/:id', contactController.deletePatch)

router.patch('/undo/:id', contactController.undoPatch)

router.patch('/delete-destroy/:id', contactController.deleteDestroyPatch)

router.patch('/trash/change-multi', contactController.trashChangeMultiPatch)

router.patch('/change-multi', contactController.changeMultiPatch)

router.get('/send-mail/:id', contactController.sendMail)

router.patch('/send-mail/:id', contactController.sendMailPatch)

module.exports = router;