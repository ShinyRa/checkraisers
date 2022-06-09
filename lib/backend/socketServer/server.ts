import { Server } from 'socket.io';
import UserDAO from '../dao/user/UserDAO';
import { Phase } from '../entities/poker_rules/round/Phase';
import Player from '../entities/poker_rules/Player';
import { deckAPI } from '../entities/poker_rules/deck/deckAPI';

// Localhost
const port = 3001;

const io = new Server(port, {
	cors: {
		origin: '*',
		credentials: true
	}
});

console.log('server started');

const objectToArray = (object) => {
	const keys = Object.keys(object);
	const array = [];
	keys.forEach((val) => {
		array.push(object[val]);
	});
	return array;
};

const handOutCards = (players: Player[]) => {
	const data = deckAPI.shuffleDeck();
	players.forEach((player) => {
		[1, 2].forEach(() => player.hand.deal(data.deck.draw()));
		console.log(players);
	});
};

type Match = {
	started?: boolean;
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
			currentPlayerMove: {}
		};
		matches[data.matchName] = {
			started: false,
			host: data.host,
			name: data.matchName,
			bigBlind: data.bigBlind,
			maxPlayers: data.maxPlayers,
			rounds: round,
			players: {}
		};
		io.in('lobby').emit('matches-list', matches);
	});

	socket.on('start-match', (data) => {
		const match = matches[data.matchName];
		match.started = true;
		match.players = objectToArray(match.players);
		match.rounds.currentPlayerMove = matches[data.matchName].players[data.email];
		handOutCards(match.players);
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

	socket.on('leave-match', (data) => {
		delete matches[data.matchName].players[data.email];
		io.in('lobby').emit('matches-list', matches);
		io.in(data.matchName).emit('match-data', matches[data.matchName]);
	});

	socket.on('disconnect', () => {
		console.log('disconnected');
	});

	socket.on('join-lobby', () => {
		socket.join('lobby');
		io.in('lobby').emit('matches-list', matches);
	});

	socket.on('leave-lobby', () => {
		socket.disconnect();
	});
});
