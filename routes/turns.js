const express = require('express');
const Turn = require('../models/Turn');
const router = express.Router();

// Crear un turno
router.post('/addTurns', async (req, res) => {
  const { number, time, status, userId,barberiaId } = req.body;

  try {
    await Turn.create({ number, time, status,userId,barberiaId });
    res.send({status: "Exito", data: "TUrno creado"});
  } catch (error) {
    res.send({status: "Error en el servidor", data: error});
  }
});



// Leer (Obtener todos los turnos)
router.post('/getTurns', async (req, res) => {
  const {barberiaId} = req.body;
  try{

    Turn.find({barberiaId: barberiaId}).then((data) =>{
        return res.send({status: "Exito", data: data});
    });
  } catch(error){
    return res.send({error: error});
  }
});

router.post('/getUserTurno', async (req, res) => {
  const {userId} = req.body;
  try{

    Turn.findOne({userId: userId}).then((data) =>{
        return res.send({status: "Exito", data: data});
    });
  } catch(error){
    return res.send({error: error});
  }
});

//Obtener servicios en el turno
router.post('/getTurnsService', async (req, res) => {
  const {turnoid} = req.body;
  try{

    Turn.findOne({_id: turnoid}).then((data) =>{
        return res.send({status: "Exito", data: data});
    });
  } catch(error){
    return res.send({error: error});
  }
});

// Actualizar un turno

router.post("/updateTurno", async (req, res) =>{
  const {turnoid} = req.body;
  if (!turnoid){
    return res.send("Turno no encontrado");
  } 
  try{
     
      await Turn.updateOne(
          {_id: turnoid},
          {
              $set:{
                status: "sentado"

              },
          }
      );
      res.send({status: "Exito", data: "Gasto Actualizado"});

  }catch(error){
      return res.send({error: "no actualizado"});
  }
});

// Eliminar un turno
router.delete('/:id', async (req, res) => {
  try {
    const turn = await Turn.findById(req.params.id);
    if (!turn) return res.status(404).json({ msg: 'Turno no encontrado' });

    await turn.remove();
    res.json({ msg: 'Turno eliminado' });
  } catch (error) {
    res.status(500).send('Error en el servidor');
  }
});

router.post('/deleteTurno', async (req, res) => {
  const {turnoid} = req.body;

  try {
    
    await Turn.deleteOne({_id: turnoid});
    res.send({status: "Exito", data: "Turno Eliminado"});

  }catch(error){
      return res.send({error: error});
  }
});

module.exports = router;
