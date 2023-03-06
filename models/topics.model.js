const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const topicsSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: [true, 'Se necesita al menos un interés'],
    }
});

const Topics = mongoose.model('Topics', topicsSchema);

module.exports = Topics;