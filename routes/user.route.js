const express = require('express');

const router = express.Router();

// RUTAS
const {
    createUser,
    getUser,
    getAllUsers,
    updateUser,
    deleteUser,
} = require(`${__dirname}/../controllers/user.controller.js`);
const {
    loginUser,
    signUpUser,
    logout,
    protect,
    getMe,
} = require(`${__dirname}/../controllers/authentication.controller.js`);

router.post('/signup', signUpUser);
router.post('/login', loginUser);

router.use(protect);
router.get('/me', getMe, getUser);
router.get('/logout', logout);

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
