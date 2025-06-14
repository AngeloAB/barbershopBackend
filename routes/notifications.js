const express = require('express');
const Notification = require('../models/Notification');
const User = require('../models/user');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

const admin = require('firebase-admin');
const serviceAccount = require('../ServiceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Crear una notificación
router.post('/addNotifi', async (req, res) => {
  const { title, message, time } = req.body;

  try {
    await Notification.create({ title, message, time });
    res.send({status: "Exito", data: "Notificacion creada"});
  } catch (error) {
    res.send({status: "Error", data: error});
  }
});


router.post('/addNoti', async (req, res) => {
  const { title, message, time, barberiaId } = req.body;


  try {
    await Notification.create ({ title, message, time, barberiaId  });
   // const newUser = await user.savd();
    res.send({status: "Exito", data: "Notificación creada"});
  //  res.json({ success: true, message: "User created successfully.", data: null });
} catch (error) {
   // res.status(500).json({ success: false, message: error.message });
   res.send({status: "Error", data: error});
}
});


// Leer todas las notificaciones
router.post('/notifidata', async (req, res) => {
  const {barberiaId} = req.body;
  try{

      Notification.find({barberiaId: barberiaId}).then((data) =>{
          return res.send({status: "Exito", data: data});
      });
  } catch(error){
     return res.send({error: error});
  }
});



// Función para enviar notificación usando Firebase Cloud Messaging
const sendNotification = async (deviceNotiToken, title, message) => {
  const messagePayload = {
    token: deviceNotiToken,
    notification: {
      title: title,
      body: message,
    },
    android: {
      priority: 'high',
    },
    apns: {
      payload: {
        aps: {
          sound: 'default',
        },
      },
    },
  };

  try {
    const response = await admin.messaging().send(messagePayload);
    console.log('Notificación enviada:', response);
  } catch (error) {
    console.error('Error al enviar la notificación:', error);
  }
};

// Función para enviar notificaciones a todos los usuarios de una barbería
const sendNotificationToBarberia = async (barberiaId, title, message) => {
  try {
    // Obtener los usuarios que pertenecen a la barbería con el `barberiaId` específico
    const users = await User.find({ barberiaId: barberiaId });
    console.log("usuarios de la barberia: ", users);
    // Iterar sobre los usuarios y enviar la notificación a cada uno
    users.forEach(user => {
      if (user.deviceNotiToken) {
        sendNotification(user.deviceNotiToken, title, message);
      }
    });
  } catch (error) {
    console.error('Error al enviar notificaciones:', error);
  }
};

// Endpoint para recibir la solicitud de enviar notificación desde el frontend
router.post('/send-notification', async (req, res) => {
  const { barberiaId, title, message } = req.body;

 // const { deviceNotiToken, title, message } = req.body;
  
  
    // if (!barberiaId || !title || !message) {
    //   //return res.status(400).json({ message: 'Datos insuficientes para enviar notificación' });
    //   return res.send({status: "Error", data: "Datos insuficientes para enviar notificación"});
 
    // }

  try {
    await sendNotificationToBarberia(barberiaId, title, message);
   //await sendNotification(deviceNotiToken, title, message);
   // res.status(200).json({ message: 'Notificación enviada correctamente' });
    return res.send({status: "Exito", data: "Notificación enviada correctamente"});
  } catch (error) {
    console.error('Error al enviar notificación:', error);
    //res.status(500).json({ message: 'Error al enviar notificación' });
    return res.send({status: "Error", data: "Error al enviar notificación"});
  }
});

// Actualizar una notificación
router.post("/updateNoti", async (req, res) =>{
  const {notifid, title, message, time } = req.body;
  if (!notifiid){
    return res.send("Notificacion no encontrada");
  } 
  try{
     
      await Turn.updateOne(
          {_id: notifid},
          {
              $set:{
                title,
                message,
                time

              },
          }
      );
      res.send({status: "Exito", data: "Notificacion Actualizada"});

  }catch(error){
      return res.send({error: "no actualizado"});
  }
});

// Eliminar una notificación

router.post('/deleteNoti', async (req, res) => {
  const {notiid} = req.body;

  try {
    
    await Notification.deleteOne({_id: notiid});
    res.send({status: "Exito", data: "Notificación Eliminada"});

  }catch(error){
      return res.send({error: error});
  }
});

module.exports = router;
