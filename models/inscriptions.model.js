const mongoose = require('mongoose');

const inscriptionSchema = new mongoose.Schema({
    user: {
        type: ObjectID,
        required: [true, 'Campo de usuario necesario'],
    },
    course: {
        type: ObjectID,
        required: [true, 'Campo de curso necesario'],
    },
});

const Inscription = mongoose.model('Inscription', inscriptionSchema);

module.exports = Inscription;
