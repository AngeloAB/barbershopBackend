const express = require('express');
const Platform = require('../models/Platform');
const router = express.Router();

// Crear un servicio
router.post('/addPlatform', async (req, res) => {
  const { web, email,telefono } = req.body;

  try {
    Platform.create({ web, email,telefono  });
    res.send({status: "Exito", data: "Plataforma creado"});
  } catch (error) {
    return res.send({error: error});
  }

       
});

// Leer (Obtener todos los servicios)
router.get('/dataPlatform', async (req, res) => {

  try{

    Platform.find().then((data) =>{
        return res.send({status: "Exito", data: data});
    });
} catch(error){
   return res.send({error: error});
}

});



// Actualizar un servicio
router.post('/updatePlatform', async (req, res) => {
  const {platfId, web, email, telefono } = req.body;

    try{
      
        await Platform.updateOne(
            {_id: platfId},
            {
                $set:{
                    web, email, telefono

                },
            }
        );
        res.send({status: "Exito", data: "Plataforma Actualizada"});

    }catch(error){
        return res.send({error: error});
    }
});



module.exports = router;
