"use strict";
exports.__esModule = true;
var socket_io_1 = require("socket.io");
// Localhost
var port = 3001;
var io = new socket_io_1.Server(port);
console.log('server started');
io.on('connection', function (socket) {
    console.log("user connected: " + socket.id);
    socket.once('disconnect', function () {
        console.log("user: " + socket.id + " left");
        socket.emit('set_socket_status');
    });
});
