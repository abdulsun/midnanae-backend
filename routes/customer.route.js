const router = require('express').Router();

const user = require('../controllers/customer/user.conroller')
const userMiddleware = require('../middleware/user.middleware.js');
const cart = require('../controllers/customer/cart/cart.controller')
const sell = require('../controllers/customer/sell/sell.controller')

router.get('/read',  user.read);
router.get('/read/:customer_id',  user.singleread);
router.put('/update/:customer_id',  user.update);
router.delete('/delete/:customer_id',  user.delete);


// Manage User Api       
// router.post('/', user.login)
router.post('/signup', userMiddleware.validateRegister, user.signup);
// router.get('/auth',  userMiddleware.isLoggedIn, user.auth);
router.get('/read',  user.read);
router.get('/name',  user.readname);
router.delete('/delete/:customer_id',  user.delete);
router.put('/update/:customer_id',  user.update);

router.post('/fullcart', cart.fullcart);
router.get('/cart/dt-read/:customer_id', cart.read);
router.get('/cart/read/:customer_id', cart.cutomerread);
router.delete('/cart/delete/:cart_id', cart.delete);
router.delete('/cart/cus/delete/:customer_id', cart.deleteformcus);

router.get('/sell/read-address/:customer_id', sell.singleread);

module.exports = router