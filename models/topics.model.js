const { topic } = require('firebase-functions/v1/pubsub');
const mongoose = require('mongoose');

const topicsSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: [true, 'Se necesita al menos un interés'],
        unique: [true, 'Este interes ya existe. Elige otro.'],
    },
});


topicsSchema.pre('remove', async function () {
    const User = require('../models/users.model')
    const Course = require('../models/courses.model')

    // obtain the topic that is going to be deleted
    const topic = this;

    await User.updateMany(
        {topics: { $in: [topic._id] } },
        {$pull: {topics: topic._id}}
    );

    await Course.updateMany(
        // search the ones that have this topic
        {topics: { $in: [topic._id] } },
        // delete the topic from the course
        {$pull: {topics: topic._id}}
    );
    // delete the topic 
    await Topics.deleteOne({_id: topic._id});
});

const Topics = mongoose.model('Topics', topicsSchema);

module.exports = Topics;
