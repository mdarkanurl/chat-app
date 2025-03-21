import { Server } from "socket.io";
import http from 'http';
import express from 'express';
import { Socket } from "dgram";
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000']
    }
});

export const getReceiverSocketId = (userId) => {
    return userSockerMap[userId];
}

const userSockerMap = {};

io.on('connection', (Socket) => {
    console.log(`A user connected ${Socket.id}`);

    const userId = Socket.handshake.query.userId;
    if(userId) userSockerMap[userId] = Socket.id;

    io.emit('getOnlineUser', Object.keys(userSockerMap));

    Socket.on('disconnect', () => {
        console.log('A user disconnected', Socket.id);
        delete userSockerMap[userId];
        io.emit('getOnlineUser', Object.keys(userSockerMap));
    });
})

export { io, app, server };