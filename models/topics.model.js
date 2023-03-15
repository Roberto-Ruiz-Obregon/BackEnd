const mongoose = require('mongoose');

const topicsSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: [true, 'Se necesita al menos un interés'],
        unique: [true, 'Este interes ya existe. Elige otro.'],
    },
});

const Topics = mongoose.model('Topics', topicsSchema);

module.exports = Topics;
