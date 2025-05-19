const router = require('express').Router();
const multer  = require('multer');

const cloudinaryHelper = require("../../helpers/cloudinary.helper");

const upload = multer({ storage: cloudinaryHelper.storage });

const tourController = require("../../controllers/admin/tour.controller");

const tourValidate = require("../../validates/admin/tour.validate");

router.get('/list', tourController.list)

router.get('/create', tourController.create)

router.post('/create', 
    // upload.single('avatar'),
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'images', maxCount: 10 }
    ]),
    tourValidate.createPost,
    tourController.createPost
)

router.get('/trash', tourController.trash)

router.get('/edit/:id', tourController.edit)

router.patch('/edit/:id', 
    // upload.single('avatar'), 
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'images', maxCount: 10 }
    ]),
    tourValidate.createPost,
    tourController.editPatch
)

router.patch('/delete/:id', tourController.deletePatch)

router.patch('/change-multi', tourController.changeMultiPatch)

router.patch('/undo/:id', tourController.undoPatch)

router.patch('/delete-destroy/:id', tourController.deleteDestroyPatch)

router.patch('/trash/change-multi', tourController.trashChangeMultiPatch)

module.exports = router;