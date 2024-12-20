const express = require('express');
const Barberias = require('../models/Barberias');
const Membresia = require('../models/Membresia');
const router = express.Router();

// Crear una barberia
router.post('/addBarberia', async (req, res) => {
    const { name, propietario, pais, telefono} = req.body;
  
    try {
      const barberiaNew = await Barberias.create({ name, propietario, pais, telefono });
      

      // Crear membresía gratuita de 10 días
        const fechaInicio = new Date();
        const fechaFin = new Date(fechaInicio);
        fechaFin.setDate(fechaInicio.getDate() + 10); // Añadir 10 días

        const nuevaMembresía = await Membresia.create({
            barberiaId: barberiaNew._id,
            plan: 'Prueba Gratuita',
            fechaInicio: fechaInicio.toISOString(),
            fechaFin: fechaFin.toISOString(),
            estado: 'activo',
            pagado: true,  // Como es gratuita, se puede marcar como pagada
          });

          res.send({status: "Exito", datamembresia: nuevaMembresía, databarberia: barberiaNew});



    } catch (error) {
      return res.send({error: error});
    }
  
         
});

// Leer (Obtener todas las barberias)
router.post('/dataBarberia', async (req, res) => {
    try{
  
      Barberias.find().then((data) =>{
          return res.send({status: "Exito", data: data});
      });
  } catch(error){
     return res.send({error: error});
  }
  
  });

  // Leer (Obtener  barberia por id)
router.post('/dataBarberiaID', async (req, res) => {
    const {barberiaId} = req.body;
    try{
  
      Barberias.findOne({_id: barberiaId}).then((data) =>{
          return res.send({status: "Exito", data: data});
      });
  } catch(error){
     return res.send({error: error});
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
router.post("/updateBarberia", async (req, res) =>{
    const {barberiaId, name, pais, telefono } = req.body;
    try{
        
        await Barberias.updateOne(
            {_id: barberiaId},
            {
                $set:{
                    name,
                    pais, 
                    telefono
                    

                },
            }
        );
        res.send({status: "Exito", data: "Actualizada"});

    }catch(error){
        return res.send({error: error});
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
