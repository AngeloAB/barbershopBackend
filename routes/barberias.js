const express = require('express');
const Barberias = require('../models/Barberias');
const Membresia = require('../models/Membresia');
const router = express.Router();

// Crear una barberia
router.post('/addBarberia', async (req, res) => {
    const { name, propietario, pais, telefono} = req.body;
  
    try {
      const barberiaNew = await Barberias.create({ name, propietarioId: "h", propietario, pais, telefono });
      

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


  // Leer (Obtener todas las barberias mas usuarios y membresias)
  

  router.get("/dataClientesAdmin", async (req, res) => {
    try {
      const data = await Barberias.aggregate([
        {
          $lookup: {
            from: "users",
            let: { propietarioIdStr: "$propietarioId" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: [{ $type: "$$propietarioIdStr" }, "string"] },
                      {
                        $eq: [
                          "$_id",
                          {
                            $cond: {
                              if: { $regexMatch: { input: "$$propietarioIdStr", regex: /^[0-9a-fA-F]{24}$/ } },
                              then: { $toObjectId: "$$propietarioIdStr" },
                              else: null
                            }
                          }
                        ]
                      }
                    ]
                  }
                }
              }
            ],
            as: "usuario"
          }
        },
        {
          $unwind: {
            path: "$usuario",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "membresias",
            let: { barberiaIdStr: { $toString: "$_id" } },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$barberiaId", "$$barberiaIdStr"] }
                }
              }
            ],
            as: "membresia"
          }
        },
        {
          $unwind: {
            path: "$membresia",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 0,
            name: "$usuario.username",
            email: "$usuario.email",
            status: "$membresia.estado",
            barberiaName: "$name",
            plan: "$membresia.plan",
            fechaInicio: "$membresia.fechaInicio",
            fechaFin: "$membresia.fechaFin"
          }
        }
      ]);
  
      return res.json(data);
    } catch (error) {
      console.error("❌ Error en /dataClientesAdmin:", error.message);
      return res.status(500).json({ mensaje: "Error al generar el reporte", error: error.message });
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

router.post("/updateBarberiaUser", async (req, res) =>{
  const {barberiaId, propietarioId } = req.body;
  try{
      
      await Barberias.updateOne(
          {_id: barberiaId},
          {
              $set:{
                propietarioId
                  

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
