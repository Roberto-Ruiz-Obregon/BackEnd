const mongoose = require('mongoose');

/*  This is the model for a payment receipt, not an invoice nor a bill
      invoice: request for payment (contización)
      receipt: proof that the invoice was fulfilled
      bill: proof that a payment was made, normally issued by the billing platform
*/
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
  },
  // TODO: que este campo sea read_only desde el front ybi que lo rellene el controlador dependiendo de lo que diga Stripe
  status: {
    type: String,
    enum: {values: ['Pendiente', 'Rechazado', 'Aceptado']},
    required: [true, 'Status required'],
  },
  billImageURL: {
    type: String,
    validate: {
      validator: value => (
          /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(value)
      ),
      message: props => `${props.value} no es una URL válida`
  }
  }
  // TODO: see how integrating with Stripe will affect this model
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
