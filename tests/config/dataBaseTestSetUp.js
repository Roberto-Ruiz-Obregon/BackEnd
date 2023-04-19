// All functions here will be used to set up documents in the test environment.
// Must call on beforeAll function and after ConnectDB
// All creations must be true to validations, to test errors and validators, please use tests.
const mongoose = require('mongoose');
const Admin = require('../../models/admins.model');
const User = require('../../models/users.model');

// Used for login: DO NOT CHANGE
const createUser = async () => {
    await User.create({
        name: 'Dummy User',
        age: 12,
        gender: 'Mujer',
        job: 'Estudiante',
        educationLevel: 'Secundaria',
        postalCode: 76060,
        email: 'dummy_user@gmail.com',
        password: 'contra123',
        passwordConfirm: 'contra123',
    });
};

// Used for login: DO NOT CHANGE
const createAdmin = async () => {
    await Admin.create({
        name: 'Dummy Admin',
        email: 'dummy_admin@gmail.com',
        password: 'contra123',
        passwordConfirm: 'contra123',
        hasVerification: true,
    });
};

module.exports = { createUser, createAdmin };
