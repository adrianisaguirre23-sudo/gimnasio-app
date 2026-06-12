const express = require('express');
const router = express.Router();
const Socio = require('../models/Socio');
const auth = require('../middleware/auth');

// Aplicar auth a todas las rutas
router.use(auth);

// Listar
router.get('/', async (req, res) => {
  const socios = await Socio.find().sort({ createdAt: -1 });
  res.render('socios/index', { socios });
});

// Formulario crear
router.get('/nuevo', (req, res) => res.render('socios/form', { socio: null, error: null }));

// Crear
router.post('/', async (req, res) => {
  try {
    await Socio.create(req.body);
    res.redirect('/socios');
  } catch (err) {
    res.render('socios/form', { socio: null, error: 'Verifica los datos ingresados' });
  }
});

// Ver detalle
router.get('/:id', async (req, res) => {
  const socio = await Socio.findById(req.params.id);
  const rutinas = await require('../models/Rutina').find({ socio: req.params.id });
  res.render('socios/show', { socio, rutinas });
});

// Formulario editar
router.get('/:id/editar', async (req, res) => {
  const socio = await Socio.findById(req.params.id);
  res.render('socios/form', { socio, error: null });
});

// Actualizar
router.put('/:id', async (req, res) => {
  try {
    await Socio.findByIdAndUpdate(req.params.id, req.body, { runValidators: true });
    res.redirect('/socios');
  } catch (err) {
    const socio = await Socio.findById(req.params.id);
    res.render('socios/form', { socio, error: 'Verifica los datos' });
  }
});

// Eliminar
router.delete('/:id', async (req, res) => {
  await Socio.findByIdAndDelete(req.params.id);
  res.redirect('/socios');
});

module.exports = router;