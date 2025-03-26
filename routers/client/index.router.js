const router = require('express').Router();
const homeRouters = require("./home.router");
const tourRouters = require("./tour.router");

router.use('/', homeRouters)
router.use('/tours', tourRouters)

module.exports = router;
