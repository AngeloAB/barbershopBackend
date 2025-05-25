const express = require('express');
const cron = require('node-cron');
const Plan = require('../models/Planes');
const Planes = require('../models/Planes');
const router = express.Router();



 
// Crear una venta
router.post('/addPlan', async (req, res) => {
  const {  name, price, funciones} = req.body;

  try {
    Plan.create({ name, price, funciones});
    res.send({status: "Exito", data: "Plan creado"});
  } catch (error) {
    return res.send({error: error});
  }
});


router.get('/plandata', async (req, res) => {
  try{

      Plan.find().then((data) =>{
          return res.send({status: "Exito", data: data});
      });
  } catch(error){
     return res.send({error: error});
  }
});

// Actualizar un servicio
router.put('/update', async (req, res) => {
  const {planId, name, price, funciones } = req.body;

    try{
      
        await Plan.updateOne(
            {_id: planId},
            {
                $set:{
                    name,
                    price,
                    funciones

                },
            }
        );
        res.send({status: "Exito", data: "Plan Actualizado"});

    }catch(error){
        return res.send({error: error});
    }
});

// Eliminar un servicio
router.delete('/delete', async (req, res) => {
  const {planId} = req.body;

    try {
      
      await Plan.deleteOne({_id: planId});
      res.send({status: "Exito", data: "Plan Eliminado"});

    }catch(error){
        return res.send({error: error});
    }
});

module.exports = router;
