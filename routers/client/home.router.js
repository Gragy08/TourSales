const router = require('express').Router();

//nhung file controller bang ten bien
const homeController = require("../../controllers/client/home.controller");

router.get('/', homeController.home);

module.exports = router;