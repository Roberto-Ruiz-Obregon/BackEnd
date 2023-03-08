const mongoose = require('mongoose');

const inscriptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Campo de usuario necesario'],
    },
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: [true, 'Campo de curso necesario'],
    },
}, { timestamps: true });

const Inscription = mongoose.model('Inscription', inscriptionSchema);

module.exports = Inscription;
