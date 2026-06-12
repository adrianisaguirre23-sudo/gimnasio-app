require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Socio = require('./models/Socio');
const Rutina = require('./models/Rutina');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Conectado a MongoDB...');

  await User.deleteMany({});
  await Socio.deleteMany({});
  await Rutina.deleteMany({});

  await User.create({
    nombre: 'Demo User',
    email: 'demo@demo.com',
    password: 'Demo1234'
  });

  const socios = await Socio.insertMany([
    { nombre: 'Carlos Pérez', email: 'carlos@mail.com', telefono: '6671234567', fechaNacimiento: new Date('1990-05-15'), membresia: 'mensual' },
    { nombre: 'Ana García', email: 'ana@mail.com', telefono: '6679876543', fechaNacimiento: new Date('1995-08-22'), membresia: 'anual' },
    { nombre: 'Luis Martínez', email: 'luis@mail.com', telefono: '6675551234', fechaNacimiento: new Date('1988-03-10'), membresia: 'trimestral' },
  ]);

  await Rutina.insertMany([
    { nombre: 'Cardio Matutino', descripcion: 'Rutina de cardio de baja intensidad', diasSemana: ['Lunes','Miércoles','Viernes'], duracionMinutos: 45, nivel: 'principiante', socio: socios[0]._id },
    { nombre: 'Fuerza Total', descripcion: 'Trabajo de fuerza con pesas libres', diasSemana: ['Martes','Jueves'], duracionMinutos: 60, nivel: 'intermedio', socio: socios[1]._id },
    { nombre: 'HIIT Avanzado', descripcion: 'Intervalos de alta intensidad', diasSemana: ['Lunes','Martes','Jueves'], duracionMinutos: 30, nivel: 'avanzado', socio: socios[2]._id },
    { nombre: 'Yoga y Flexibilidad', descripcion: 'Estiramiento y postura', diasSemana: ['Sábado'], duracionMinutos: 60, nivel: 'principiante', socio: socios[0]._id },
  ]);

  console.log('✅ Seed completado');
  console.log('   Usuario demo: demo@demo.com / Demo1234');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });