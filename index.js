const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const http = require('http');  // Para utilizar con Socket.IO
const { Server } = require('socket.io');

// Crear el servidor HTTP
const server = http.createServer(app);

// Crear una instancia de Socket.IO y vincularla al servidor HTTP
const io = new Server(server, {
    cors: {
        origin: '*', // Permitir todas las conexiones (ajústalo según sea necesario)
        methods: ['GET', 'POST'],
    }
});

//?Middle wair
app.use(cors({ origin: '*' }))
app.use(bodyParser.json());
app.use(express.json());
//? setting static folder path
app.use('/image/users', express.static('public/users'));
app.use('/image/services', express.static('public/services'));

const URL = process.env.MONGO_URL;
mongoose.connect(URL);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to BASE DE DATOS'));

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
  
    // Escuchar cuando un cliente agrega un nuevo turno
    socket.on('nuevoTurno', (turno) => {
      console.log('Turno recibido:', turno);
      io.emit('turnoActualizado', turno);  // Emitir el turno a TODOS los clientes
    });

    // Escuchar cuando un admin actualiza un  turno
    socket.on('TurnoEstado', (turno) => {
        console.log('Turno recibido:', turno);
        io.emit('turnoActualizadoEstado', turno);  // Emitir el turno a TODOS los clientes
      });
  
    // Escuchar cuando un cliente elimina un turno
    socket.on('turnoEliminado', (turnoId) => {
      console.log('Turno eliminado:', turnoId);
      io.emit('turnoEliminado', turnoId);  // Emitir el evento de turno eliminado a TODOS los clientes
    });
  
    socket.on('disconnect', () => {
      console.log('Cliente desconectado');
    });
  });

// Routes
app.use('/barberias', require('./routes/barberias'));
app.use('/membresias', require('./routes/membresias'));
app.use('/barbers', require('./routes/barbers'));
app.use('/expenses', require('./routes/expenses'));
app.use('/notifications', require('./routes/notifications'));
app.use('/sales', require('./routes/sales'));
app.use('/services', require('./routes/services'));
app.use('/turns', require('./routes/turns'));
app.use('/users', require('./routes/user'));
app.use('/payment', require('./routes/payment'));
app.use('/planes', require('./routes/planes'));
app.use('/platform', require('./routes/platform'));


// Example route using asyncHandler directly in app.js
app.get('/', asyncHandler(async (req, res) => {
    res.json({ success: true, message: 'API working successfully', data: null });
}));

// Global error handler
app.use((error, req, res, next) => {
    res.status(500).json({ success: false, message: error.message, data: null });
});


server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});


