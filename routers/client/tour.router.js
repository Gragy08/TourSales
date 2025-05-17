const router = require('express').Router();

//nhung file controller bang ten bien
const tourController = require("../../controllers/client/tour.controller");

// router.get('/', tourController.list);

// router.get('/tour')

router.get('/detail', tourController.detail);

module.exports = router;