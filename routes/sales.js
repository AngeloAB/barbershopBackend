const express = require('express');
const Sale = require('../models/Sale');
const router = express.Router();

// Crear una venta
router.post('/addSales', async (req, res) => {
  const { date, service, amount, barberiaId } = req.body;

  try {
    Sale.create({ date, service, amount , barberiaId});
    res.send({status: "Exito", data: "Venta creada"});
  } catch (error) {
    return res.send({error: error});
  }
});

// Leer todas las ventas
router.get('/', async (req, res) => {
  try {
    const sales = await Sale.find();
    res.json(sales);
  } catch (error) {
    res.status(500).send('Error en el servidor');
  }
});

router.post('/salesdata', async (req, res) => {
  const {barberiaId} = req.body;
  try{

      Sale.find({barberiaId: barberiaId}).then((data) =>{
          return res.send({status: "Exito", data: data});
      });
  } catch(error){
     return res.send({error: error});
  }
});

// Leer una venta por ID
router.get('/:id', async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(404).json({ msg: 'Venta no encontrada' });
    res.json(sale);
  } catch (error) {
    res.status(500).send('Error en el servidor');
  }
});

// Actualizar una venta
router.put('/:id', async (req, res) => {
  const { turnNumber, attendedBy, date } = req.body;

  try {
    let sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(404).json({ msg: 'Venta no encontrada' });

    sale.turnNumber = turnNumber || sale.turnNumber;
    sale.attendedBy = attendedBy || sale.attendedBy;
    sale.date = date || sale.date;

    await sale.save();
    res.json(sale);
  } catch (error) {
    res.status(500).send('Error en el servidor');
  }
});

// Eliminar una venta
router.delete('/:id', async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(404).json({ msg: 'Venta no encontrada' });

    await sale.remove();
    res.json({ msg: 'Venta eliminada' });
  } catch (error) {
    res.status(500).send('Error en el servidor');
  }
});

module.exports = router;
