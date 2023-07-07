const { Server } = require('socket.io');
const { roles } = require('./database/constants');

let io = null

const initialize = (http) => {
    io = new Server(http, {
        cors: {
            origin: process.env.CLIENT_URL
        }
    })
    io.on('connection', (socket) => {
        console.log(`⚡: ${socket.id} connected`);
    
        socket.on('disconnect', () => {
          console.log('🔥: A user disconnected');
        });

        socket.on('register', (rol) => {
            if(rol === roles.ADMIN) socket.join("admin")
        })

        socket.on('sessionDisconnect', (rol) => {
            if(rol === roles.ADMIN) socket.leave("admin")
        })
    });
}

const getIO = () => io

module.exports = initialize
module.exports.socket = getIO