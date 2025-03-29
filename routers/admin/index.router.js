const router = require('express').Router();
const accountRouters = require("./account.router");

router.use('/account', accountRouters)

module.exports = router;
