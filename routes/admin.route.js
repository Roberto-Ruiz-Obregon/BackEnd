const express = require('express');

const router = express.Router();


const {
    createAdmin,
    getAdmin,
    getAllAdmins,
    updateAdmin,
    deleteAdmin,
} = require(`${__dirname}/../controllers/admin.controller.js`);
const {
    loginAdmin,
    signUpAdmin,
    logout,
    getMe,
    editMe,
    protect,
    restrictTo,
} = require(`${__dirname}/../controllers/authentication.controller.js`);
const {
    forgotPasswordAdmin,
    resetPasswordAdmin,
} = require(`${__dirname}/../controllers/password.controller.js`);

router.post('/auth/signup', signUpAdmin);
router.post('/auth/login', loginAdmin);
router.post('/forgotpassword', forgotPasswordAdmin);
router.patch('/resetpassword/:id', resetPasswordAdmin);

router.use(protect);
router.get('/auth/me', getMe, getAdmin);
router.patch('/auth/updateme', editMe);
router.get('/auth/logout', logout);

router.use(restrictTo('Admin'));
router.route('/').get(getAllAdmins).post(createAdmin);
router.route('/:id').get(getAdmin).patch(updateAdmin).delete(deleteAdmin);

module.exports = router;
