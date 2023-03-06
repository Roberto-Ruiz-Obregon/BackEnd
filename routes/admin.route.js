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
} = require(`${__dirname}/../controllers/authentication.controller.js`);

router.post('/signup', signUpAdmin);
router.post('/login', loginAdmin);

router.route('/').get(getAllAdmins).post(createAdmin);
router.route('/:id').get(getAdmin).patch(updateAdmin).delete(deleteAdmin);

module.exports = router;
