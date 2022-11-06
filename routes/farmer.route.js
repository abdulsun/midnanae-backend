const router = require('express').Router();

const dtcare = require('../controllers/farmer/support/dt-care.controller')
const grow = require('../controllers/farmer/support/grow.controller')
const farmer = require('../controllers/farmer/former.conroller')
const request = require('../controllers/farmer/sale/request.controller')
//  const dtpurch = require('../controllers/admin/purch/dt-purch.controller')

const userMiddleware = require('../middleware/user.middleware.js');
router.post('/signup', userMiddleware.validateRegister, farmer.signup);

router.put('/update/:farmer_id',  farmer.update);
router.get("/read/:farmer_id",farmer.singleread)

// // Manage purch product Api
// router.get('/', purch.read)
router.post("/create-dtcare",dtcare.create)
router.get("/read-dtcare/all/:care_id",dtcare.read)
// router.patch('/update-purch/:order_product_id',purch.update);
// router.delete('/delete-purch/:order_product_id',purch.delete);

// // Manage payment purch product Api
router.post('/create-grow', grow.create);
router.get('/read-grow', grow.read);
router.put('/update-grow', grow.update);
router.delete('/delete-grow/:grow_id', grow.delete);


 router.get('/request', request.read);
 router.get('/request/singel', request.farmerread);
 router.post("/request/create",request.create)
 router.put('/request/update',request.update);
 router.delete('/request/delete/:req_id',request.delete);

router.get('/read',  farmer.read);
router.get('/name',  farmer.readname);
router.delete('/delete/:farmer_id',  farmer.delete);

module.exports = router