const express = require('express');
const router = express.Router();
const Rutina = require('../models/Rutina');
const Socio = require('../models/Socio');
const auth = require('../middleware/auth');

router.use(auth);

const DIAS = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];

router.get('/', async (req, res) => {
  const rutinas = await Rutina.find().populate('socio').sort({ createdAt: -1 });
  res.render('rutinas/index', { rutinas });
});

router.get('/nueva', async (req, res) => {
  const socios = await Socio.find({ activo: true });
  res.render('rutinas/form', { rutina: null, socios, dias: DIAS, error: null });
});

router.post('/', async (req, res) => {
  try {
    const data = { ...req.body };
    // diasSemana puede venir como string si solo se selecciona uno
    if (typeof data.diasSemana === 'string') data.diasSemana = [data.diasSemana];
    await Rutina.create(data);
    res.redirect('/rutinas');
  } catch (err) {
    const socios = await Socio.find({ activo: true });
    res.render('rutinas/form', { rutina: null, socios, dias: DIAS, error: 'Verifica los datos' });
  }
});

router.get('/:id/editar', async (req, res) => {
  const rutina = await Rutina.findById(req.params.id);
  const socios = await Socio.find({ activo: true });
  res.render('rutinas/form', { rutina, socios, dias: DIAS, error: null });
});

router.put('/:id', async (req, res) => {
  try {
    const data = { ...req.body };
    if (typeof data.diasSemana === 'string') data.diasSemana = [data.diasSemana];
    await Rutina.findByIdAndUpdate(req.params.id, data, { runValidators: true });
    res.redirect('/rutinas');
  } catch (err) {
    const socios = await Socio.find({ activo: true });
    const rutina = await Rutina.findById(req.params.id);
    res.render('rutinas/form', { rutina, socios, dias: DIAS, error: 'Verifica los datos' });
  }
});

router.delete('/:id', async (req, res) => {
  await Rutina.findByIdAndDelete(req.params.id);
  res.redirect('/rutinas');
});

module.exports = router;