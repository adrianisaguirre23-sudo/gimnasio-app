const mongoose = require('mongoose');

const rutinaSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  descripcion: { type: String, required: true },
  diasSemana: [{ 
    type: String, 
    enum: ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'] 
  }],
  duracionMinutos: { type: Number, required: true, min: 10, max: 300 },
  nivel: { 
    type: String, 
    enum: ['principiante', 'intermedio', 'avanzado'], 
    required: true 
  },
  // REFERENCIA a Socio (ObjectId) — elegimos referencia porque
  // una rutina puede consultarse independientemente del socio
  socio: { type: mongoose.Schema.Types.ObjectId, ref: 'Socio', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Rutina', rutinaSchema);