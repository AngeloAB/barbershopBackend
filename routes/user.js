const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const User = require('../models/user');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Get all users
router.get('/', asyncHandler(async (req, res) => {
    try {
        const users = await User.find();
        res.json({ success: true, message: "Users retrieved successfully.", data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));



// login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });


        if (!user) {
            return res.send({ data: "Invalid name or password." });
        }
        // Check if the password is correct

        if(await bcrypt.compare(password, user.password)){
            const token = jwt.sign({email:user.email}, process.env.JWT_SECRET);
             

            if(res.status(201)){
                return res.send({status: "Exito", data: token})
            }else{
                res.send({status: "Error", data: error});
            }
        }

        if (user.password !== password) {
            return res.status(401).json({ success: false, message: "Invalid name or password." });
        }

   
});

//Obtener datos del usuario

router.post('/userdata', async (req, res) =>{

    const {token} = req.body;
    try{
        const user = jwt.verify(token, process.env.JWT_SECRET)
        const useremail = user.email;

        User.findOne({email: useremail}).then((data) =>{
            return res.send({status: "Exito", data: data});
        });
    } catch(error){
       return res.send({error: error});
    }
  
});
//Obtener por el rol de barbero
router.post('/barberdata', async (req, res) =>{
   const {barberiaId} = req.body;

    try{

        User.find({role: "barber", barberiaId: barberiaId}).then((data) =>{
            return res.send({status: "Exito", data: data});
        });
    } catch(error){
       return res.send({error: error});
    }
  
});


// Get a user by ID
router.get('/:id', asyncHandler(async (req, res) => {
    try {
        const userID = req.params.id;
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        res.json({ success: true, message: "User retrieved successfully.", data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

// Create a new user
router.post('/addUser', asyncHandler(async (req, res) => {
    const { username, email, password, role, barberiaId, preferenciaBarber, preferenciaCorte,deviceNotiToken} = req.body;

    const oldUser = await User.findOne({email: email});

    

    
    if ( !username || !email || !password ) {
        return res.status(400).json({ success: false, message: "Name, and password are required." });
    }

    if(oldUser){
        return res.send({data: "Usuario existente"});
    }

    const encryptedPassword = await bcrypt.hash(password,10);

    try {
        await User.create ({ username, email, password: encryptedPassword, role: 'admin', barberiaId, preferenciaBarber: 'Ninguna', preferenciaCorte:  'Ninguna', deviceNotiToken});
       // const newUser = await user.save();
        res.send({status: "Exito", data: "Usuario creado"});
      //  res.json({ success: true, message: "User created successfully.", data: null });
    } catch (error) {
       // res.status(500).json({ success: false, message: error.message });
       res.send({status: "Error", data: error});
    }
}));

// Create a new user
router.post('/register', asyncHandler(async (req, res) => {
    const { username, email, password, role, barberiaId, preferenciaBarber, preferenciaCorte, deviceNotiToken} = req.body;

    const oldUser = await User.findOne({email: email});

    
    if ( !username || !email || !password ) {
        return res.status(400).json({ success: false, message: "Name, and password are required." });
    }

    if(oldUser){
        return res.send({data: "Usuario existente"});
    }

    const encryptedPassword = await bcrypt.hash(password,10);

    try {
        await User.create ({ username, email, password: encryptedPassword, role: 'client', barberiaId, preferenciaBarber: 'Ninguna', preferenciaCorte:  'Ninguna', deviceNotiToken});
       // const newUser = await user.save();
        res.send({status: "Exito", data: "Usuario creado"});
      //  res.json({ success: true, message: "User created successfully.", data: null });
    } catch (error) {
       // res.status(500).json({ success: false, message: error.message });
       res.send({status: "Error", data: error});
    }
}));

//Crear barbero

router.post('/registerbarbero', asyncHandler(async (req, res) => {
    const { username, email, password, role,barberiaId, deviceNotiToken } = req.body;

    const oldUser = await User.findOne({email: email});

    
    if ( !username || !email || !password ) {
        return res.status(400).json({ success: false, message: "Name, and password are required." });
    }

    if(oldUser){
        return res.send({data: "Usuario existente"});
    }

    const encryptedPassword = await bcrypt.hash(password,10);

    try {
        await User.create ({ username, email, password: encryptedPassword, role: 'barber' ,barberiaId,preferenciaBarber: 'Ninguna', preferenciaCorte:  'Ninguna', deviceNotiToken});
       // const newUser = await user.save();
        res.send({status: "Exito", data: "Usuario creado"});
      //  res.json({ success: true, message: "User created successfully.", data: null });
    } catch (error) {
       // res.status(500).json({ success: false, message: error.message });
       res.send({status: "Error", data: error});
    }
}));

//Actualizar Usuario

router.post("/updateUser", async (req, res) =>{
    const {userid, username, email, password } = req.body;
    try{
        const encryptedPassword = await bcrypt.hash(password,10);

        await User.updateOne(
            {_id: userid},
            {
                $set:{
                    username,
                    email,
                    password: encryptedPassword,
                    

                },
            }
        );
        res.send({status: "Exito", data: "Actualizada"});

    }catch(error){
        return res.send({error: error});
    }
});

router.post("/updateTokenFCM", async (req, res) =>{
    const {userid, deviceNotiToken } = req.body;
    try{

        await User.updateOne(
            {_id: userid},
            {
                $set:{
                    deviceNotiToken,
                    

                },
            }
        );
        res.send({status: "Exito", data: "Actualizada"});

    }catch(error){
        return res.send({error: error});
    }
});

router.post("/updatePrefe", async (req, res) =>{
    const {userid, preferenciaBarber, preferenciaCorte} = req.body;
    try{
        //const encryptedPassword = await bcrypt.hash(password,10);

        await User.updateOne(
            {_id: userid},
            {
                $set:{
                    preferenciaBarber,
                    preferenciaCorte,
                    

                },
            }
        );
        res.send({status: "Exito", data: "Actualizada"});

    }catch(error){
        return res.send({error: error});
    }
});

//Eliminar barbero

router.post("/deleteBarber", async (req, res) =>{
    const {userid} = req.body;
    try{
       
        await User.updateOne(
            {_id: userid},
            {
                $set:{
                    role: "client"

                },
            }
        );
        res.send({status: "Exito", data: "Actualizada"});

    }catch(error){
        return res.send({error: error});
    }
});

// Update a user
router.put('/:id', asyncHandler(async (req, res) => {
    try {
        const userID = req.params.id;
        const { username, email, password } = req.body;
        if ( !username || !email || !password) {
            return res.status(400).json({ success: false, message: "Name, and password are required." });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userID,
            { username,email, password },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        res.json({ success: true, message: "User updated successfully.", data: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

// Delete a user
router.delete('/:id', asyncHandler(async (req, res) => {
    try {
        const userID = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userID);
        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        res.json({ success: true, message: "User deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

module.exports = router;
