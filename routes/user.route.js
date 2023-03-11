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
const {
    forgotPasswordUser,
    resetPasswordUser,
} = require(`${__dirname}/../controllers/password.controller.js`);

router.post('/auth/signup', signUpUser);
router.post('/auth/login', loginUser);
router.post('/forgotpassword', forgotPasswordUser);
router.patch('/resetpassword/:id', resetPasswordUser);

router.use('/auth', protect);
router.get('/auth/me', getMe, getUser);
router.patch('/auth/updateme', editMe);
router.get('/auth/logout', logout);

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
