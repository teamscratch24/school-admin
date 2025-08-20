const { CreateAdmin, DeleteAdmin, GetAdmins } = require('../Component/Auth');


const router = require('express').Router();

router.post('/register',CreateAdmin);
router.post('/delete',DeleteAdmin);
router.get('/users',GetAdmins);


module.exports = router