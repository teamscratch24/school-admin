const { logIn } = require('../Component/Auth');

const  router = require('express').Router();

router.post('/', logIn);

module.exports = router;