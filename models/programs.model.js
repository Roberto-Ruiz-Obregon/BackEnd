const mongoose = require('mongoose');
const validator = require('validator');

const programSchema = new mongoose.Schema(
    {
        programName: {
            type: String,
            required: [true, 'Es necesario que el programa tenga nombre'],
        },
        description: {
            type: String,
        },
        imageUrl: {
            type: String,
            required: [true, 'Una beca debe de contar con una portada'],
            validate: {
                validator: (value) =>
                    /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(value),
            },
        },
    },
    { timestamps: true }
);

const Program = mongoose.model('Program', programSchema);
module.exports = Program;
