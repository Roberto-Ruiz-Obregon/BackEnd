const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Por favor dinos tu nombre!'],
    },
    email: {
        type: String,
        required: [true, 'Debes de contar con un correo!'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Por favor provee una contraseña.'],
        // con el select no vuelve a aparecer
        minlength: [8, 'Tu contraseña debe contar con al menos 8 caracteres.'],
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Por favor confirma tu contraseña.'],
        validate: {
            // queremos contraseñas iguales
            validator: function (value) {
                return value === this.password;
            },
            message: 'Por favor ingresa la misma contraseña.',
        },
    },
});

/* This is a middleware that runs before the save() or create() method. It hashes the password and sets
the passwordConfirm to undefined. */
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
        // Mongoose wont save a field if it has been set to undefined.
        this.passwordConfirm = undefined;
    }
    return next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
