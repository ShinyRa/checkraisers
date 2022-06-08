import { Server } from 'socket.io';
import UserDAO from '../dao/user/UserDAO';
import { Phase } from '../entities/poker_rules/round/Phase';
import Player from '../entities/poker_rules/Player';

// Localhost
const port = 3001;

const io = new Server(port, {
	cors: {
		origin: '*',
		credentials: true
	}
});

console.log('server started');

//  TODO match
//  - current round / max rounds
//  - creater of match
//	- current phase

type Match = {
	host?: Player['email'];
	name?: string;
	bigBlind?: number;
	maxPlayers?: number;
	rounds?: Round;
	players?: Record<string, Player>;
};

type Round = {
	phase: Phase;
	roundsPlayed: number;
	potSize: number;
	playersPlaying: Record<string, Player>;
	currentPlayerMove: Match['players'];
};

const matches: Match = {};
const userDAO: UserDAO = new UserDAO();

io.on('connection', function (socket) {
	io.to(socket.id).emit('matches-list', matches);

	socket.on('new-match', (data) => {
		const round: Round = {
			phase: Phase.PRE_FLOP,
			roundsPlayed: 0,
			potSize: 0,
			playersPlaying: {},
			currentPlayerMove: {}
		};
		matches[data.matchName] = {
			host: data.host,
			name: data.matchName,
			bigBlind: data.bigBlind,
			maxPlayers: data.maxPlayers,
			rounds: round,
			players: {}
		};
		io.in('lobby').emit('matches-list', matches);
	});

	socket.on('disconnect', () => {
		console.log('disconnected');
	});

	socket.on('leave-match', (data) => {
		delete matches[data.matchName].players[data.email];
		io.in('lobby').emit('matches-list', matches);
		io.in(data.matchName).emit('match-data', matches[data.matchName]);
	});

	socket.on('join-match', async (data) => {
		const userData = await userDAO.getProfile(data.email);
		socket.join(data.matchName);
		console.log('na het joinen: ', socket.rooms);
		const newPlayer = new Player(
			userData['email'],
			userData['username'],
			userData['profilePicture'],
			userData['chips']
		);
		matches[data.matchName].players[newPlayer.email] = newPlayer;
		io.in('lobby').emit('matches-list', matches);
		io.in(data.matchName).emit('match-data', matches[data.matchName]);
	});

	socket.on('join-lobby', () => {
		socket.join('lobby');
		io.in('lobby').emit('matches-list', matches);
	});

	socket.on('leave-lobby', () => {
		socket.disconnect();
	});
});
