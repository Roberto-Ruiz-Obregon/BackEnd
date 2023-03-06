const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    courseName: {
        type: String,
    },
    topic: {
        type: String,
    },
    description: {
        type: Number,
    },
    teachers: {
        type: String,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    schedule: {
        type: Date,
    },
    duration: {
        type: Number,
    },
    accessLink: {
        type: String,
    },
    accessCode: {
        type:  String,
    },
    
    zoomLink: {
        type: String,
    },
});

const User = mongoose.model('Course', userSchema);

module.exports = Courses;