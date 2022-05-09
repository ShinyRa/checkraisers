"use strict";
exports.__esModule = true;
var socket_io_1 = require("socket.io");
// Localhost
var port = 3001;
var io = new socket_io_1.Server(port, {
    cors: {
        origin: "*",
        credentials: true
    }
});
console.log('server started');
var matches = {};
io.on('connection', function (socket) {
    console.log("user connected: " + socket.id);
    io.to(socket.id).emit('matches-list', matches);
    socket.on("disconnect", function () {
        console.log(socket.id);
    });
    socket.on('new-match', function (data) {
        matches[data.matchName] = { name: data.matchName, bigBlind: data.bigBlind, maxPlayers: data.maxPlayers, players: {} };
        io["in"]("lobby").emit('matches-list', matches);
    });
    socket.on('leave-match', function (data) {
        delete matches[data.matchName].players[data.email];
        io["in"]("lobby").emit('matches-list', matches);
    });
    socket.on('join-match', function (data) {
        socket.join(data.matchName);
        console.log("match name: ",data.matchName);
        matches[data.matchName].players[data.email] = {
            email: data.email,
            username: data.username,
            chips: data.chips
        };
        io["in"](data.matchName).emit('player-joined', matches[data.matchName]);
        io["in"]("lobby").emit('matches-list', matches);
    });
    socket.on('join-lobby', function () {
        socket.join('lobby');
        io["in"]("lobby").emit('matches-list', matches);
    });
    socket.on('leave-lobby', function () {
        socket.disconnect();
    });
});
