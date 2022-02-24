import { Server } from 'socket.io';

export class SocketServer {
    private io: Server;

    public initServer(server): boolean {
        try{
            this.io = new Server(server.httpServer);
            return true
        }catch(e){
            return false
        }
    }            
}
