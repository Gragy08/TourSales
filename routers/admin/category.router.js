const router = require('express').Router();
// The Multer library is a middleware for Express.js, 
// used to handle file upload requests (usually from multipart/form-data forms, 
// the common type of form when users send files from client to server).
const multer = require('multer');
// const upload = multer();

const categoryController = require("../../controllers/admin/category.controller");

// Embed multerUploadCloudinary library
const cloudinaryHelper =  require("../../helpers/cloudinary.helper");

const categoryValidate = require("../../validates/admin/category.validate");

const upload = multer({ storage: cloudinaryHelper.storage});

router.get('/list', categoryController.list)

router.get('/create', categoryController.create)

// avarta is a name of field that FE send to BE
router.post('/create', upload.single('avatar'), categoryValidate.createPost, categoryController.createPost)

router.get('/edit/:id', categoryController.edit)

router.patch('/edit/:id', upload.single('avatar'), categoryValidate.createPost, categoryController.editPatch)

router.patch('/delete/:id', categoryController.deletePatch)

router.patch('/change-multi', categoryController.changeMultiPatch)

module.exports = router;