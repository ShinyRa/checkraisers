import { Server } from "socket.io";

// Localhost
const port = 3001;

const io = new Server(port, {
  cors: {
    origin: "*",
    credentials: true
  }
});

console.log('server started')

io.on('connection', function(socket){
  console.log("user connected: "+socket.id);
              
  socket.on('disconnect', function() {
    console.log("user: "+socket.id+" left");
    socket.emit('set_socket_status');
  });
});