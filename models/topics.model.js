const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const topicsSchema = new mongoose.Schema({
    topics: {
        type: [String],
    }
});

const Topics = mongoose.model('Topics', topicsSchema);

module.exports = Topics;