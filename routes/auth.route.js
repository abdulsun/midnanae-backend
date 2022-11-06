const router = require('express').Router();

const userMiddleware = require('../middleware/user.middleware.js');
const admin = require('../controllers/admin/admin.conroller')
const user = require('../controllers/customer/user.conroller')

router.get('/checkrole', userMiddleware.checkRole);
router.post('/login',userMiddleware.authLogin);
router.post('/signup/all',userMiddleware.validateRegister ,user.signupall);

module.exports = router