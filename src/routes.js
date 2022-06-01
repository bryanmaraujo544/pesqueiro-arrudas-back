const { Router } = require('express');
const ProductController = require('./app/controllers/ProductController');
const AuthController = require('./app/controllers/AuthController');
const router = Router();

router.get('/', (req, res) => {
  console.log(process.env.MONGO_URI);

  res.send('oioioi');
});

router.post('/auth/login', AuthController.index);

router.get('/products', ProductController.index);
router.post('/products', ProductController.store);
router.delete('/products/:id', ProductController.delete);

module.exports = router;
