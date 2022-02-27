import { Server } from 'socket.io';

export let io;

export const initServer = (server) =>{
    io = new Server(server.httpServer); 
}
      