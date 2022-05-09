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
type Match = {
  name?: string,
  bigBlind?: number,
  maxPlayers?: number,
  players?: Record<string, Player>
}

type Player = {
  email: string,
  username: string,
  chips: number
}

const matches: Match = {}

io.on('connection', function(socket){
  console.log("user connected: "+socket.id);
  io.to(socket.id).emit('matches-list', matches)

  socket.on("disconnect", () => {
    console.log(socket.id);
  });

  socket.on('new-match', (data) => {
    matches[data.matchName] = {name: data.matchName, bigBlind: data.bigBlind, maxPlayers: data.maxPlayers, players: {}}
    io.in("lobby").emit('matches-list', matches)
  })

  socket.on('leave-match', (data) => {
    delete matches[data.matchName].players[data.email]
    io.in("lobby").emit('matches-list', matches)
  })

  socket.on('join-match', (data) => {
    socket.join(data.matchName)
    console.log(data.matchName)
    matches[data.matchName].players[data.email]= {
      email: data.email, 
      username: data.username, 
      chips: data.chips
    }
    io.in(data.matchName).emit('player-joined',matches[data.matchName])
    io.in("lobby").emit('matches-list', matches)
  })

  socket.on('join-lobby', () => {
    socket.join('lobby');
    io.in("lobby").emit('matches-list', matches)
  })

  socket.on('leave-lobby', () => {
    socket.disconnect()
  })
})