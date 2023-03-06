const express = require('express');

const router = express.Router();

// RUTAS
const {
    createAdmin,
    getAdmin,
    getAllAdmins,
    updateAdmin,
    deleteAdmin,
} = require(`${__dirname}/../controllers/Admin.controller.js`);
const {
    loginAdmin,
    signUpAdmin,
    logout,
    getMe,
    editMe,
    protect,
} = require(`${__dirname}/../controllers/authentication.controller.js`);

router.post('/signup', signUpAdmin);
router.post('/login', loginAdmin);

router.use('/auth', protect);
router.get('/auth/me', getMe, getAdmin);
router.patch('/auth/updateme', editMe);
router.get('/auth/logout', logout);

router.route('/').get(getAllAdmins).post(createAdmin);
router.route('/:id').get(getAdmin).patch(updateAdmin).delete(deleteAdmin);

module.exports = router;
