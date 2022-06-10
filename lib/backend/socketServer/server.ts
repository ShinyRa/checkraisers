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

const handOutCards = (players: Player[]): Player[] => {
	const data = deckAPI.shuffleDeck();
	players.forEach((player) => {
		[1, 2].forEach(() => player.hand.deal(data.deck.draw()));
	});
	return players;
};

const findPlayer = (players: Player[], email: string): Player | false => {
	let res: Player | false = false;
	players.forEach((player) => {
		if (player.email === email) res = player;
	});
	return res;
};

export type Match = {
	started?: boolean;
	host?: Player['email'];
	message?: string | null;
	name?: string;
	bigBlind?: number;
	maxPlayers?: number;
	rounds?: Round;
	players?: Player[];
};

type Round = {
	phase: Phase;
	roundsPlayed: number;
	potSize: number;
	currentPlayerMove: Player['email'];
};

const matches: Match = {};
const userDAO: UserDAO = new UserDAO();

io.on('connection', function (socket) {
	socket.on('new-match', (data) => {
		const round: Round = {
			potSize: 0,
			currentPlayerMove: '',
			phase: Phase.PRE_FLOP,
			roundsPlayed: 0
		};
		matches[data.matchName] = {
			started: false,
			host: data.host,
			message: null,
			name: data.matchName,
			bigBlind: data.bigBlind,
			maxPlayers: data.maxPlayers,
			rounds: round,
			players: []
		};
		io.in('lobby').emit('matches-list', matches);
	});

	socket.on('start-match', (data) => {
		matches[data.matchName].message = 'The round has started!';
		matches[data.matchName].started = true;
		matches[data.matchName].rounds.currentPlayerMove = matches[data.matchName].host;
		matches[data.matchName].players = handOutCards(matches[data.matchName].players);
		io.in('lobby').emit('matches-list', matches);
		io.in(data.matchName).emit('match-data', matches[data.matchName]);
	});

	socket.on('pause-match', (data) => {
		matches[data.matchName].message = 'The round has been paused...';
		io.in('lobby').emit('matches-list', matches);
		io.in(data.matchName).emit('match-data', matches[data.matchName]);
	});

	socket.on('stop-match', (data) => {
		io.in(data.matchName).emit('match-data', 'exit');
		delete matches[data.matchName];
		io.in('lobby').emit('matches-list', matches);
	});

	socket.on('resume-match', (data) => {
		matches[data.matchName].message = 'The round has been resumed!';
		io.in('lobby').emit('matches-list', matches);
		io.in(data.matchName).emit('match-data', matches[data.matchName]);
	});

	socket.on('get-match-data', (data) => {
		socket.join(data.matchName);
		io.to(socket.id).emit('match-data', matches[data.matchName]);
	});

	socket.on('join-match', async (data) => {
		const userData = await userDAO.getProfile(data.email);
		if (!findPlayer(matches[data.matchName].players, data.email)) {
			socket.leave('lobby');
			socket.join(data.matchName);
			const newPlayer = new Player(
				userData['email'],
				userData['username'],
				userData['profilePicture'],
				userData['chips']
			);
			matches[data.matchName].players.push(newPlayer);
			io.in('lobby').emit('matches-list', matches);
			io.in(data.matchName).emit('match-data', matches[data.matchName]);
		} else {
			io.to(socket.id).emit('match-data', matches[data.matchName]);
		}
	});

	socket.on('leave-match', (data) => {
		matches[data.matchName].players.forEach((player, index) => {
			if (player.email === data.email) {
				matches[data.matchName].players.splice(index, 1);
			}
		});
		io.in('lobby').emit('matches-list', matches);
		io.in(data.matchName).emit('match-data', matches[data.matchName]);
	});

	socket.on('disconnect', () => {
		console.log('disconnected user: ', socket.id);
	});

	socket.on('join-lobby', () => {
		socket.join('lobby');
		io.in('lobby').emit('matches-list', matches);
	});

	socket.on('leave-lobby', () => {
		socket.leave('lobby');
	});
});
