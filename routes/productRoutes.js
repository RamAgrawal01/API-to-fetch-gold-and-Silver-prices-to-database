const express = require('express');
const router = express.Router();

const { createProduct, getProducts } = require('../controllers/productController');



router.post('/create', createProduct);
router.get('/products',getProducts)

module.exports = router;