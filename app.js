require('dotenv').config();
process.on('uncaughtException', err => {
  console.error('UNCAUGHT:', err);
  process.exit(1);
});
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const path = require('path');

const app = express();

// Conexión MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB 7 conectado'))
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