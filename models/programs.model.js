const mongoose = require('mongoose');
const validator = require('validator');

const programSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Es necesario que el programa tenga nombre'],
    },
    descripcion : {
        type: String,
    },
    imageUrl: { 
        type: String,
        validate: {
            validator: value => (
                /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(v)
            ),
        },
    }
}, { timestamps: true });

const Program = mongoose.model('Program', programSchema);
module.exports = Program;
