const express = require('express');
const Expense = require('../models/Expense');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

// Crear un gasto
router.post('/addGastos', async (req, res) => {
  const { date, description, amount,barberiaId } = req.body;

//   try {
//     const expense = new Expense({ date, description, amount });
//     await expense.save();
//     res.json(expense);
//   } catch (error) {
//     res.status(500).send('Error en el servidor');
//   }

  try {
    await Expense.create ({ date, description, amount,barberiaId });
   // const newUser = await user.savd();
    res.send({status: "Exito", data: "Gasto creado"});
  //  res.json({ success: true, message: "User created successfully.", data: null });
} catch (error) {
   // res.status(500).json({ success: false, message: error.message });
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

router.post('/expensesdata', async (req, res) => {
  const {barberiaId} = req.body;
    try{

        Expense.find({barberiaId: barberiaId}).then((data) =>{
            return res.send({status: "Exito", data: data});
        });
    } catch(error){
       return res.send({error: error});
    }
});


// Actualizar un gasto
router.put('/:id', async (req, res) => {
  const { date, description, amount } = req.body;

  try {
    let expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ msg: 'Gasto no encontrado' });

    expense.date = date || expense.date;
    expense.description = description || expense.description;
    expense.amount = amount || expense.amount;

    await expense.save();
    res.json(expense);
  } catch (error) {
    res.status(500).send('Error en el servidor');
  }
});



router.post("/updateGasto", async (req, res) =>{
    const {gastoid, date, description, amount} = req.body;
    try{
       
        await Expense.updateOne(
            {_id: gastoid},
            {
                $set:{
                    date,
                    description,
                    amount,

                },
            }
        );
        res.send({status: "Exito", data: "Gasto Actualizado"});

    }catch(error){
        return res.send({error: error});
    }
});

// Eliminar un gasto
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ msg: 'Gasto no encontrado' });

    await expense.remove();
    res.json({ msg: 'Gasto eliminado' });
  } catch (error) {
    res.status(500).send('Error en el servidor');
  }
});

router.post('/deleteGasto', async (req, res) => {
    const {gastoid} = req.body;

    try {
      
      await Expense.deleteOne({_id: gastoid});
      res.send({status: "Exito", data: "Gasto Eliminado"});

    }catch(error){
        return res.send({error: error});
    }
});

module.exports = router;
