const express = require('express');
const {
  authUser,
  getUserProfile,
  getUserData,
  getAccessToken,
  registerUser,
  confirmUser,
  mailForEmailVerification,
  mailForPasswordReset,
  resetUserPassword,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  getUserById,
  updateUser,
} = require('../controllers/userControllers.js');
const { protectRoute, isAdmin } = require('../middleware/authMiddleware.js');

const router = express.Router();

// @desc register a new user & get all users if admin
// @route POST /api/users/
// @access PUBLIC || PRIVATE?ADMIN
router.post('/', registerUser).get('/', protectRoute, isAdmin, getAllUsers);

// @desc authenticate user and get token
// @route POST /api/users/login
// @access PUBLIC
router.post('/login', authUser);

// @desc confirm the email address of the registered user
// @route GET /api/users/confirm
// @access PUBLIC
router.get('/confirm/:token', confirmUser);

// @desc send a mail with the link to verify mail, to be used if the user forgot to verify mail after registration
// @route POST /api/users/confirm
// @access PUBLIC
router.post('/confirm', mailForEmailVerification);

// @desc send a mail with the link to reset password
// @route POST /api/users/reset
// and
// @desc reset password of any verified user
// @route PUT /api/users/reset

// @access PUBLIC
router.post('/reset', mailForPasswordReset).put('/reset', resetUserPassword);

// @desc obtain new access tokens using the refresh tokens
// @route GET /api/users/refresh
// @access PUBLIC
router.post('/refresh', getAccessToken);

// @desc get data for an authenticated user, and update data for an authenticated user
// @route PUT & GET /api/users/profile
// @access PRIVATE
router
  .get('/profile', protectRoute, getUserProfile)
  .put('/profile', protectRoute, updateUserProfile);

// @desc get user data for google login in the frontend
// @route POST /api/users/passport/data
// @access PUBLIC
router.post('/passport/data', getUserData);

// @desc Delete a user, get a user by id, update the user
// @route DELETE /api/users/:id
// @access PRIVATE/ADMIN
router.delete('/:id', protectRoute, isAdmin, deleteUser);
router.get('/:id', protectRoute, isAdmin, getUserById);
router.put('/:id', protectRoute, isAdmin, updateUser);

module.exports = router;
