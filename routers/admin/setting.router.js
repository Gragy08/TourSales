const router = require('express').Router();

const multer  = require('multer');

const settingController = require("../../controllers/admin/setting.controller");

const cloudinaryHelper = require("../../helpers/cloudinary.helper");

const upload = multer({ storage: cloudinaryHelper.storage });

router.get('/list', settingController.list)

// Website Info Page
router.get('/website-info', settingController.websiteInfo)

router.patch('/website-info',
    // upload 2 files: logo and favicon, read more at multer documentation
    upload.fields(
        [
          { name: 'logo', maxCount: 1 },
          { name: 'favicon', maxCount: 1 }
        ]
    ),   
    settingController.websiteInfoPatch)
// End Website Info Page

// Account Admin Page
router.get('/account-admin/list', settingController.accountAdminList)

router.get('/account-admin/create', settingController.accountAdminCreate)

router.post('/account-admin/create', 
  upload.single("avatar"),
  settingController.accountAdminCreatePost)

router.get('/account-admin/edit/:id', settingController.accountAdminEdit)

router.patch('/account-admin/edit/:id', 
  upload.single("avatar"), 
  settingController.accountAdminEditPatch
)

router.patch('/account-admin/delete/:id', settingController.accountAdminDeletePatch)

router.get('/account-admin/trash', settingController.accountAdminTrash)

router.patch('/account-admin/trash/change-multi', settingController.accountAdminTrashChangeMultiPatch)

router.patch('/account-admin/undo/:id', settingController.accountAdminUndoPatch)

router.patch('/account-admin/delete-destroy/:id', settingController.accountAdminDeleteDestroyPatch)

router.patch('/account-admin/change-multi', settingController.accountAdminChangeMultiPatch)
// End Account Admin Page

// Role Page
router.get('/role/list', settingController.roleList)

router.get('/role/create', settingController.roleCreate)

router.post('/role/create', settingController.roleCreatePost)

router.get('/role/edit/:id', settingController.roleEdit)

router.patch('/role/edit/:id', settingController.roleEditPatch)

router.get('/role/trash', settingController.roleTrash)

router.patch('/role/delete/:id', settingController.roleDeletePatch)

router.patch('/role/change-multi', settingController.roleChangeMultiPatch)

router.patch('/role/undo/:id', settingController.roleUndoPatch)

router.patch('/role/delete-destroy/:id', settingController.roleDeleteDestroyPatch)
// End Role Page

module.exports = router;