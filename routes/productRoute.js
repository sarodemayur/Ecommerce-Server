const express = require('express');
const {products, findProductById} = require('../controllers/productController')
const router = express.Router();

router.route('/product').get(products);

router.route('/product/:id').get(findProductById);

module.exports = router;
