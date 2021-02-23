const express = require('express');
const http = require('http');
const socket = require('socket.io');

const app = express();
const server = http.createServer(app);
const waitingRoomRoutes = require('./src/routes/waiting-room')
const io = socket(server);
const port = 8080;

// Routes
app.use('/waitingroom', waitingRoomRoutes);

const users = {};

// socket.io listeners go here
io.on('connection', socket => {
    if (!users[socket.id]) {
      users[socket.id] = socket.id;
      console.log(`User ${socket.id} connected`);
      
    }
    socket.emit("yourID", socket.id);
    io.sockets.emit("allUsers", users);

    socket.on('disconnect', () => {
      console.log(`${socket.id} disconnected`)
      delete users[socket.id];
    })

    socket.on("callUser", (data) => {
      io.to(data.userToCall).emit('hey', {signal: data.signalData, from: data.from});
    })

    socket.on("acceptCall", (data) => {
      io.to(data.to).emit('callAccepted', data.signal);
    })
});

server.listen(port, () => {
    console.log(`application server listening on ${port}`)
});
