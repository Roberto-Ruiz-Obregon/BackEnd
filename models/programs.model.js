const mongoose = require('mongoose');
const validator = require('validator');
const AppError = require('../utils/appError');

const programSchema = new mongoose.Schema(
    {
        programName: {
            type: String,
            required: [true, 'Es necesario que el programa tenga nombre'],
        },
        description: {
            type: String,
        },
        category: {
            type: String,
            enum: { values: ['Beca', 'Evento', 'Apoyo', 'Programa', 'Otro'] },
            required: [true, 'Es necesaria una categoría'],
        },
        imageUrl: {
            type: String,
            required: [true, 'Una beca debe de contar con una portada'],
            validate: {
                validator: (value) =>
                    /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(value),
            },
        },
        hasLimit: {
            type: String,
            enum: {
                values: [
                    'Sin limite de inscripcion',
                    'Con limite de inscripcion',
                ],
            },
            required: [
                true,
                'Debes especificar si este programa tiene fecha limite.',
            ],
        },
        limitDate: {
            type: Date,
        },
    },
    { timestamps: true }
);

// Indexing program properties for optimized search
programSchema.index({ programName: 1 });
programSchema.index({ category: 1 });

programSchema.pre('validate', function () {
    if (
        this.hasLimit == 'Con limite de inscripcion' &&
        this.limitDate < new Date()
    ) {
        throw new AppError('La fecha limite debe estar en el futuro', 400);
    }
});

const Program = mongoose.model('Program', programSchema);
module.exports = Program;
