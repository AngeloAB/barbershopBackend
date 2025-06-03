const express = require('express');
const cron = require('node-cron');
const Membresia = require('../models/Membresia');
const router = express.Router();

// Lógica de verificación
const verificarExpiracionMembresias = async () => {
    const fechaActual = new Date();
  
    try {
      const membresias = await Membresia.find({ estado: 'activo' });
  
      membresias.forEach(async (membresia) => {
        const fechaFin = new Date(membresia.fechaFin);
        if (fechaFin < fechaActual) {
          membresia.estado = 'inactivo';
          await membresia.save();
          console.log(`La membresía de la barbería con ID ${membresia.barberiaId} ha expirado.`);
        }
      });
    } catch (error) {
      console.error('Error al verificar expiración de membresías:', error);
    }
  };

  // Configurar el cron job para que se ejecute una vez al día
cron.schedule('33 23 * * *', () => {
    console.log('Ejecutando verificación de membresías...');
    verificarExpiracionMembresias();
  });

// Crear una venta
router.post('/addMembresia', async (req, res) => {
  const {  barberiaId, plan, fechaInicio,fechaFin,estado,pagado} = req.body;

  try {
    Membresia.create({ barberiaId, plan, fechaInicio,fechaFin,estado,pagado});
    res.send({status: "Exito", data: "Membresia creada"});
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

router.post('/membresiadata', async (req, res) => {
  const {barberiaId} = req.body;
  try{

      Membresia.findOne({barberiaId: barberiaId}).then((data) =>{
          return res.send({status: "Exito", data: data});
      });
  } catch(error){
     return res.send({error: error});
  }
});

//mostrar todas sin importar barberia
router.post('/membresiadataAdmin', async (req, res) => {
  try{

      Membresia.find().then((data) =>{
          return res.send({status: "Exito", data: data});
      });
  } catch(error){
     return res.send({error: error});
  }
});


// PATCH /membresias/:id/reset
router.patch('/:id/reset', async (req, res) => {
  try {
    const { id } = req.params;
    const nuevaFechaInicio = new Date();
    const nuevaFechaFin = new Date();
    nuevaFechaFin.setMonth(nuevaFechaInicio.getMonth() + 1); // Ej: 1 mes

    const updated = await Membresia.findByIdAndUpdate(id, {
      fechaInicio: nuevaFechaInicio.toISOString(),
      fechaFin: nuevaFechaFin.toISOString(),
      estado: 'activo',
    }, { new: true });

    res.json(updated);
  } catch (error) {
    console.error('Error al restablecer plan:', error);
    res.status(500).json({ error: 'Error al restablecer el plan' });
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
