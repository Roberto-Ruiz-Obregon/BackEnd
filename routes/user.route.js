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
} = require(`${__dirname}/../controllers/authentication.controller.js`);

router.post('/signup', signUpUser);
router.post('/login', loginUser);

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
