const express = require('express');
const {
  deleteProduct,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
} = require('../controllers/productControllers.js');
const { protectRoute, isAdmin } = require('../middleware/authMiddleware.js');

const router = express.Router();

// @desc fetch all the products, create a product
// @route GET /api/products
// @access PUBLIC
router.get('/', getAllProducts);
router.post('/', protectRoute, isAdmin, createProduct);

// @desc fetch top rated products
// @route GET /api/products/top
// @access PUBLIC
router.get('/top', getTopProducts);

// @desc Fetch a single product by id, Delete a product,  update a product
// @route GET /api/products/:id
// @access PUBLIC & PRIVATE/ADMIN
router.get('/:id', getProductById);
router.delete('/:id', protectRoute, isAdmin, deleteProduct);
router.put('/:id', protectRoute, isAdmin, updateProduct);

// @desc Create a product review
// @route POST /api/products/:id/reviews
// @access PRIVATE
router.post('/:id/reviews', protectRoute, createProductReview);

module.exports = router;
