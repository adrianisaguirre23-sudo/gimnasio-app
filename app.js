require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo').default || require('connect-mongo');
const methodOverride = require('method-override');
const path = require('path');

const app = express();

// Conexión MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ MongoDB 7 conectado');
    const User = require('./models/User');
    const count = await User.countDocuments();
    if (count === 0) {
      console.log('🌱 Cargando datos demo...');
      const Socio = require('./models/Socio');
      const Rutina = require('./models/Rutina');
      await User.create({ nombre: 'Demo User', email: 'demo@demo.com', password: 'Demo1234' });
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
      console.log('✅ Datos demo cargados - demo@demo.com / Demo1234');
    }
  })
  .catch(err => console.error('❌ Error:', err));

// Middlewares
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

// Rutas
app.use('/auth', require('./routes/auth'));
app.use('/socios', require('./routes/socios'));
app.use('/rutinas', require('./routes/rutinas'));
app.get('/', (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard');
  res.redirect('/auth/login');
});
app.get('/dashboard', require('./middleware/auth'), (req, res) => {
  res.render('dashboard', { user: req.session.userName });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));