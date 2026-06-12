const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/login', (req, res) => res.render('login', { error: null }));
router.get('/register', (req, res) => res.render('register', { error: null }));

router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.render('register', { error: 'Email ya registrado' });
    const user = await User.create({ nombre, email, password });
    req.session.userId = user._id;
    req.session.userName = user.nombre;
    res.redirect('/dashboard');
  } catch (err) {
    console.error('ERROR REGISTER:', err);
    res.render('register', { error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.render('login', { error: 'Credenciales invalidas' });
    req.session.userId = user._id;
    req.session.userName = user.nombre;
    res.redirect('/dashboard');
  } catch (err) {
    res.render('login', { error: err.message });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/auth/login'));
});

module.exports = router;