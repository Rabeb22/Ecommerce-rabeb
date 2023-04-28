const express = require('express');
// import {
// 	addOrderItems,
// 	getOrderById,
// 	updateOrderToPay,
// 	updateOrderToDeliver,
// 	getMyOrders,
// 	getAllOrders,
// 	stripePayment,
// } from '../controllers/orderControllers.js';
const {
  addOrderItems,
  getOrderById,
  updateOrderToPay,
  updateOrderToDeliver,
  getMyOrders,
  getAllOrders,
  stripePayment,
} = require('../controllers/orderControllers.js');
const { protectRoute, isAdmin } = require('../middleware/authMiddleware.js');

const router = express.Router();

// @desc  create a new order, get all orders
// @route GET /api/orders
// @access PRIVATE && PRIVATE/ADMIN
router.post('/', protectRoute, addOrderItems);
router.get('/', protectRoute, isAdmin, getAllOrders);

// @desc  fetch the orders of the user logged in
// @route GET /api/orders/myorders
// @access PRIVATE
router.get('/myorders', protectRoute, getMyOrders);

// @desc  create payment intent for stripe payment
// @route POST /api/orders/stripe-payment
// @access PUBLIC
router.post('/stripe-payment', stripePayment);

// @desc  get an order by id
// @route GET /api/orders/:id
// @access PRIVATE
router.get('/:id', protectRoute, getOrderById);

// @desc  update the order object once paid
// @route PUT /api/orders/:id/pay
// @access PRIVATE
router.put('/:id/pay', protectRoute, updateOrderToPay);

// @desc  update the order object once delivered
// @route PUT /api/orders/:id/pay
// @access PRIVATE/ADMIN
router.put('/:id/deliver', protectRoute, isAdmin, updateOrderToDeliver);

module.exports = router;
