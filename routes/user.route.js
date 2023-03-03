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

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
