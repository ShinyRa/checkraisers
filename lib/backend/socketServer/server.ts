import { Server } from 'socket.io';
import UserDAO from '../dao/user/UserDAO';
import { Phase } from '../entities/poker_rules/round/Phase';
import Player from '../entities/poker_rules/Player';
import { deckAPI } from '../entities/poker_rules/deck/deckAPI';
import { ActionStack } from './../entities/poker_rules/round/ActionStack';
import CardDeck from '../entities/poker_rules/deck/CardDeck';

// Localhost
const port = 3001;

const io = new Server(port, {
	cors: {
		origin: '*',
		credentials: true
	}
});

console.log('server started');

const handOutCards = (players: Player[], data: Record<string, CardDeck>): Player[] => {
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

const trimData = (matches: Match): Match => {
	delete matches.rounds.actionStack;
	delete matches.rounds.deck;
	return matches;
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
	deck: Record<string, CardDeck> | null;
	phase: Phase;
	roundsPlayed: number;
	currentPlayerMove: Player['email'];
	actionStack: ActionStack | null;
	potSize: number;
};

const matches: Match = {};
const userDAO: UserDAO = new UserDAO();

io.on('connection', function (socket) {
	/**
	 * Creates a new match on the server
	 */
	socket.on('new-match', (data) => {
		const round: Round = {
			deck: null,
			currentPlayerMove: '',
			phase: Phase.PRE_FLOP,
			roundsPlayed: 0,
			actionStack: null,
			potSize: 0
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

	/**
	 * Starts a created match
	 *
	 * @param data {email, matchName}
	 */
	socket.on('start-match', (data) => {
		matches[data.matchName].message = 'The round has started!';
		matches[data.matchName].started = true;
		matches[data.matchName].rounds.actionStack = new ActionStack(matches[data.matchName].players);
		matches[data.matchName].rounds.deck = deckAPI.shuffleDeck();
		matches[data.matchName].rounds.currentPlayerMove =
			matches[data.matchName].rounds.actionStack.currentPlayerTurn();
		matches[data.matchName].players = handOutCards(
			matches[data.matchName].players,
			matches[data.matchName].rounds.deck
		);
		io.in('lobby').emit('matches-list', matches);
		io.in(data.matchName).emit('match-data', matches[data.matchName]);
	});

	/**
	 * Joins a match
	 *
	 * @param data {email, matchName}
	 */
	socket.on('join-match', async (data) => {
		const userData = await userDAO.getProfile(data.email);
		//is this if statement even necessary anymore? The "get-match-data" handles this use case now.
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

	/**
	 * Pauses a match if you are the host
	 *
	 * @param data {email, matchName}
	 */
	socket.on('player-action', (data) => {
		let actionStack = matches[data.matchName].rounds.actionStack as ActionStack;
		const player = findPlayer(matches[data.matchName].players, data.email);
		if (player) {
			if (Object.keys(data.action).length > 1) {
				actionStack.push(player, data.action.playerAction, data.action.chips);
			} else {
				actionStack.push(player, data.action.playerAction);
			}
		}
		matches[data.matchName].rounds.actionStack = actionStack;
		matches[data.matchName].rounds.potSize = actionStack.potSize();
		//loop through players to see whose turn it is.
		if (actionStack.currentPlayerTurn()) {
			matches[data.matchName].rounds.currentPlayerMove = actionStack.currentPlayerTurn();
		} else {
			console.log('done!');
			//If everyone is done in showdown create new action stack and set the phase back to preflop
			//TODO evalutation.
			if (matches[data.matchName].rounds.phase !== 4) {
				matches[data.matchName].rounds.phase = matches[data.matchName].rounds.phase + 1;
				actionStack.nextPhase();
			} else {
				actionStack = new ActionStack(matches[data.matchName].players);
				matches[data.matchName].rounds.phase = 0;
			}
		}
		matches[data.matchName].rounds.actionStack = actionStack;
		io.in(data.matchName).emit('match-data', matches[data.matchName]);
	});

	/**
	 * Pauses a match if you are the host
	 *
	 * @param data {email, matchName}
	 */
	socket.on('pause-match', (data) => {
		matches[data.matchName].message = 'The round has been paused...';
		io.in('lobby').emit('matches-list', matches);
		io.in(data.matchName).emit('match-data', matches[data.matchName]);
	});

	/**
	 * Stops a match if you are the host
	 *
	 * @param data {email, matchName}
	 */
	socket.on('stop-match', (data) => {
		io.in(data.matchName).emit('match-data', 'exit');
		delete matches[data.matchName];
		io.in('lobby').emit('matches-list', matches);
	});

	/**
	 * Resumes a match if you are the host
	 *
	 * @param data {email, matchName}
	 */
	socket.on('resume-match', (data) => {
		matches[data.matchName].message = 'The round has been resumed!';
		io.in('lobby').emit('matches-list', matches);
		io.in(data.matchName).emit('match-data', matches[data.matchName]);
	});

	/**
	 * Returns data of a specific match to a specific socket
	 *
	 * @param data {email, matchName}
	 */
	socket.on('get-match-data', (data) => {
		socket.join(data.matchName);
		io.to(socket.id).emit('match-data', matches[data.matchName]);
	});

	/**
	 * Leave a match
	 *
	 * @param data {email, matchName}
	 */
	socket.on('leave-match', (data) => {
		matches[data.matchName].players.forEach((player, index) => {
			if (player.email === data.email) {
				matches[data.matchName].players.splice(index, 1);
			}
		});
		io.in('lobby').emit('matches-list', matches);
		io.in(data.matchName).emit('match-data', matches[data.matchName]);
	});

	/**
	 * Disconnect the socket
	 *
	 */
	socket.on('disconnect', () => {
		console.log('disconnected user: ', socket.id);
	});

	/**
	 * Join a lobby, a room where you get information about the current matches being played.
	 *
	 */
	socket.on('join-lobby', () => {
		socket.join('lobby');
		io.in('lobby').emit('matches-list', matches);
	});

	/**
	 * Leaves the lobby
	 *	 */
	socket.on('leave-lobby', () => {
		socket.leave('lobby');
	});
});
