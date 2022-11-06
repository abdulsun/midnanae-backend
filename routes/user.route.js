const router = require('express').Router();

const user = require('../controllers/customer/user.conroller')



const admin = require('../controllers/admin/admin.conroller')
const farmer = require('../controllers/farmer/former.conroller')


router.get('/me',user.me)

// Manage User Api
// router.post('/', user.login)
// router.post('/signup', userMiddleware.validateRegister, user.signup);
// router.get('/auth',  userMiddleware.isLoggedIn, user.auth);
router.get('/read',  user.read);
router.delete('/delete/:customer_id',  user.delete);

// Manage admin Api
// router.post('/admin', admin.login)
// router.post('/admin/signup', userMiddleware.validateRegister, admin.signup);
// router.get('/admin/auth',  userMiddleware.isLoggedIn, admin.auth);



// Manage farmer Api
// router.post('/farmer', farmer.login)

// router.get('/farmer/auth',  userMiddleware.isLoggedIn, farmer.auth);
router.get('/farmer/read',  farmer.read);
router.get('/farmer/name',  farmer.readname);
router.delete('/farmer/delete/:farmer_id',  farmer.delete);

module.exports = router