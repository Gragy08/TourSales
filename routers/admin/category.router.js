const router = require('express').Router();
// The Multer library is a middleware for Express.js, 
// used to handle file upload requests (usually from multipart/form-data forms, 
// the common type of form when users send files from client to server).
const multer = require('multer');
const upload = multer();

const categoryController = require("../../controllers/admin/category.controller");

router.get('/list', categoryController.list)

router.get('/create', categoryController.create)

// avarta is a name of field that FE send to BE
router.post('/create', upload.single('avatar'), categoryController.createPost)

module.exports = router;