const mongoose = require('mongoose');

const topicsSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: [true, 'Se necesita al menos un interés'],
    },
});

const Topics = mongoose.model('Topics', topicsSchema);

module.exports = Topics;
