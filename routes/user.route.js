const express = require('express');

const router = express.Router();

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
    restrictTo,
    getMe,
    editMe,
    deleteMe,
    getMyCourses,
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
router.get('/auth/mycourses', getMyCourses);
router.patch('/auth/updateme', editMe);
router.get('/auth/deleteme', deleteMe);
router.get('/auth/logout', logout);

router.use(protect, restrictTo('Admin'));
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
