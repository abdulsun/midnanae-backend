const router = require('express').Router();

const purch = require('../controllers/admin/purch/purch.controller')
 const payment = require('../controllers/admin/purch/pm-purch.controller')
 const dtpurch = require('../controllers/admin/purch/dt-purch.controller')


// Manage purch product Api
router.get('/', purch.read)
router.get('/:order_product_id', purch.singleread)
router.post("/create-purch",purch.create)
router.put('/update-purch/:order_product_id', purch.update);
router.delete('/delete-purch/:order_product_id/:payment_purch_id',purch.delete);
 

// Manage payment purch product Api
router.get('/payment', payment.read);
router.post("/create-pmpurch",payment.create)

// // Manage detail order product Api
 router.get('/dtpurch/:order_product_id', dtpurch.read);
 router.post("/create-dtpurch",dtpurch.create)
 router.put('/update-dtpurch/:detail_order_id',dtpurch.update);
 router.delete('/delete-dtpurch/:detail_order_id',dtpurch.delete);

module.exports = router