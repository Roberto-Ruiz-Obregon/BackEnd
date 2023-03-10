const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

/* Creating a schema for the user model. */
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Por favor dinos tu nombre!'],
    },
    age: {
        type: Number,
        min: 0,
        required: [true, 'Por favor, escribe tu edad'],
    },
    emailAgreement: {
        type: Boolean,
        default: true,
    },
    gender: {
        type: String,
        required: [true, 'Por favor, selecciona tu sexo'],
        enum: ['Hombre', 'Mujer', 'Prefiero no decir'],
    },
    email: {
        type: String,
        required: [true, 'Por favor dinos tu correo!'],
        lowercase: true,
        unique: [true, 'Este correo ya esta en uso. Elige otro.'],
        trim: true,
        validate: [validator.isEmail, 'Necesitas un correo vallido.'],
    },
    topics: {
        type: mongoose.Schema.ObjectId,
        ref: 'Topics',
    },
    job: {
        type: String,
    },
    educationLevel: {
        type: String,
        enum: {
            values: [
                'Ninguno',
                'Primaria',
                'Secundaria',
                'Preparatoria',
                'Universidad',
            ],
        },
    },
    postalCode: {
        type: Number,
    },
    password: {
        type: String,
        required: [true, 'Por favor provee una contraseña.'],
        // Using select prevents the field from being retrieved
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
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
});

// MIDDLEWARES
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

/* This is a middleware that runs before the save() or create() method. Checks if the password has changed
and updates the passwordChangedAt attribute. */
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || this.isNew) return next();
    else {
        this.passwordChangedAt = Date.now() - 1000;
        next();
    }
});

// INSTANCE METHODS
// Instance methods will be available in all document instances.

/* This is a method that compares the candidate password with the user password. */
userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    // This refers to the document. Since select is false we dont have access to password.
    return await bcrypt.compare(candidatePassword, userPassword);
};

/* Creating a password reset token and saving it in the database. */
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    // We save the password reset token in the database.
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // 10 hours
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    // We return the reset token encrypted.
    return resetToken;
};

/* This method checks if the password has been changed after the token was issued. */
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        return JWTTimestamp < changedTimestamp;
    }

    // false means the password did not change
    return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
