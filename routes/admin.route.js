const router = require('express').Router();

const userMiddleware = require('../middleware/user.middleware.js'); 
const admin = require('../controllers/admin/admin.conroller')

router.post('/signup', userMiddleware.validateRegister, admin.signup);

router.get('/read', admin.read);
router.delete('/delete/:employee_id', admin.delete);
router.get('/read/:employee_id', admin.singleread);
router.put('/update/:emp', admin.update);
// router.get('/read/all/:employee_id', admin.passread);
module.exports = router