const express = require('express');
const Service = require('../models/Service');
const router = express.Router();

// Crear un servicio
router.post('/addService', async (req, res) => {
  const { name, price,barberiaId } = req.body;

  try {
    Service.create({ name, price,barberiaId });
    res.send({status: "Exito", data: "Servicio creado"});
  } catch (error) {
    return res.send({error: error});
  }

       
});

// Leer (Obtener todos los servicios)
router.post('/dataService', async (req, res) => {
  const {barberiaId} = req.body;
  try{

    Service.find({barberiaId: barberiaId}).then((data) =>{
        return res.send({status: "Exito", data: data});
    });
} catch(error){
   return res.send({error: error});
}

});

//oBterner servicio por id

router.post('/getServiceID', async (req, res) => {

  const {serviceId} = req.body;
  try{

    Service.findOne({_id: serviceId}).then((data) =>{
        return res.send({status: "Exito", data: data});
    });
} catch(error){
   return res.send({error: error});
}

});

// Actualizar un servicio
router.post('/updateService', async (req, res) => {
  const {serviceId, name, price } = req.body;

    try{
      
        await Service.updateOne(
            {_id: serviceId},
            {
                $set:{
                    name,
                    price

                },
            }
        );
        res.send({status: "Exito", data: "Servicio Actualizado"});

    }catch(error){
        return res.send({error: error});
    }
});

// Eliminar un servicio
router.post('/deleteService', async (req, res) => {
  const {serviceId} = req.body;

    try {
      
      await Service.deleteOne({_id: serviceId});
      res.send({status: "Exito", data: "Servicio Eliminado"});

    }catch(error){
        return res.send({error: error});
    }
});

module.exports = router;
