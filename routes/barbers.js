const express = require('express');
const Barber = require('../models/Barber');
const router = express.Router();

// Crear un barbero
router.post('/', async (req, res) => {
  const { name } = req.body;

  try {
    await Barber.create({ name });
    res.send({status: "Exito", data: "Barbero creado"});
  } catch (error) {
    res.send({status: "Error", data: error});
  }
});



// Leer (Obtener todos los gastos)
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (error) {
    res.status(500).send('Error en el servidor');
  }
});

// Leer todos los barberos
router.get('/', async (req, res) => {
  try {
    const barbers = await Barber.find();
    res.json(barbers);
  } catch (error) {
    res.status(500).send('Error en el servidor');
  }
});

// Leer un solo barbero por ID
router.get('/:id', async (req, res) => {
  try {
    const barber = await Barber.findById(req.params.id);
    if (!barber) return res.status(404).json({ msg: 'Barbero no encontrado' });
    res.json(barber);
  } catch (error) {
    res.status(500).send('Error en el servidor');
  }
});

// Actualizar un barbero
router.put('/:id', async (req, res) => {
  const { name } = req.body;

  try {
    let barber = await Barber.findById(req.params.id);
    if (!barber) return res.status(404).json({ msg: 'Barbero no encontrado' });

    barber.name = name || barber.name;

    await barber.save();
    res.json(barber);
  } catch (error) {
    res.status(500).send('Error en el servidor');
  }
});

// Eliminar un barbero
router.delete('/:id', async (req, res) => {
  try {
    const barber = await Barber.findById(req.params.id);
    if (!barber) return res.status(404).json({ msg: 'Barbero no encontrado' });

    await barber.remove();
    res.json({ msg: 'Barbero eliminado' });
  } catch (error) {
    res.status(500).send('Error en el servidor');
  }
});

module.exports = router;
