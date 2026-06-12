const mongoose = require('mongoose');

const socioSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  telefono: { type: String, required: true },
  fechaNacimiento: { type: Date, required: true },
  membresia: { 
    type: String, 
    enum: ['mensual', 'trimestral', 'anual'], 
    required: true 
  },
  activo: { type: Boolean, default: true }
}, { timestamps: true });

// Índice en email (requerido por la rúbrica)
socioSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('Socio', socioSchema);