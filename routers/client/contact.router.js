const router = require('express').Router();

//nhung file controller bang ten bien
const contactController = require("../../controllers/client/contact.controller");

router.post('/create', contactController.createPost);

module.exports = router;