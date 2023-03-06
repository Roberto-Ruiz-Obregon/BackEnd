const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Usuario necesario']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Curso necesario']
  },
  amount: {
    type: Number,
    required: [true, 'Cantidad pagada necesaria'],
    validate: {
      validator: value => value > 0,
      message: 'La cantidad pagada debe de ser un número positivo'
    }
  },
  paymentDate: {
    type: Date,
    required: [true, 'La fecha de pago es necesaria']
  }
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
