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
    editMe,
} = require(`${__dirname}/../controllers/authentication.controller.js`);

router.post('/auth/signup', signUpUser);
router.post('/auth/login', loginUser);

router.use('/auth', protect);
router.get('/auth/me', getMe, getUser);
router.patch('/auth/updateme', editMe);
router.get('/auth/logout', logout);

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
