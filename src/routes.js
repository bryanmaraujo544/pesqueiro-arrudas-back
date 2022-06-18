const { Router } = require('express');
const ProductController = require('./app/controllers/ProductController');
const AuthController = require('./app/controllers/AuthController');
const CommandController = require('./app/controllers/CommandController');
const PaymentController = require('./app/controllers/PaymentController');
const KitchenOrderController = require('./app/controllers/KitchenOrderController');

const router = Router();

router.get('/', (req, res) => {
  console.log(process.env.MONGO_URI);

  res.send('oioioi');
});

router.post('/auth/login', AuthController.index);

// Products Routes
router.get('/products', ProductController.index);
router.post('/products', ProductController.store);
router.delete('/products/:id', ProductController.delete);
router.put('/products/:id', ProductController.update);
router.post('/products/verify-amount', ProductController.verifyTheAmount);
router.put('/products-update-amount', ProductController.updateAmount);

// Commands Routes
router.get('/commands', CommandController.index);
router.post('/commands', CommandController.store);
router.delete('/commands/:id', CommandController.delete);
router.put('/commands/:id', CommandController.update);
router.get('/commands/:id', CommandController.show);

// Payments Routes
router.get('/payments', PaymentController.index);
router.post('/payments', PaymentController.pay);

// Kitchen Routes
router.get('/kitchen/orders', KitchenOrderController.index);
router.get('/kitchen/orders/:id', KitchenOrderController.show);
router.post('/kitchen/orders', KitchenOrderController.store);
router.put('/kitchen/orders/:id', KitchenOrderController.update);
router.delete('/kitchen/orders/:commandId', KitchenOrderController.delete);
router.get(
  '/kitchen/get-command-orders/:commandId',
  KitchenOrderController.getCommandOrders
);

module.exports = router;
