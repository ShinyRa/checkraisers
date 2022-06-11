import GameData from './GameData';
import { Server } from 'socket.io';
import UserDAO from '../dao/user/UserDAO';
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

const gameData: GameData = new GameData();
const userDAO: UserDAO = new UserDAO();

io.on('connection', function (socket) {
	/**
	 * Creates a new match on the server
	 */
	socket.on('new-match', (data) => {
		gameData.newMatch(data.host, data.matchName, data.bigBlind, data.maxPlayers);
		io.in('lobby').emit('matches-list', gameData.getMatches());
	});

	/**
	 * Starts a created match
	 *
	 * @param data {email, matchName}
	 */
	socket.on('start-match', (data) => {
		gameData.startMatch(data.matchName);
		io.in('lobby').emit('matches-list', gameData.getMatches());
		io.in(data.matchName).emit('match-data', gameData.getSpecificMatch(data.matchName));
	});

	/**
	 * Joins a match
	 *
	 * @param data {email, matchName}
	 */
	socket.on('join-match', async (data) => {
		const userData = await userDAO.getProfile(data.email);
		//is this if statement even necessary anymore? The "get-match-data" handles this use case now.
		if (!gameData.findPlayer(data.matchName, data.email)) {
			socket.leave('lobby');
			socket.join(data.matchName);
			const newPlayer = new Player(
				userData['email'],
				userData['username'],
				userData['profilePicture'],
				userData['chips']
			);
			gameData.addPlayerToMatch(data.matchName, newPlayer);
			io.in('lobby').emit('matches-list', gameData.getMatches());
			io.in(data.matchName).emit('match-data', gameData.getSpecificMatch(data.matchName));
		} else {
			io.to(socket.id).emit('match-data', gameData.getSpecificMatch(data.matchName));
		}
	});

	socket.on('player-action', (data) => {
		gameData.playerAction(data.email, data.matchName, data.action.playerAction, data.action.chips);
		io.in(data.matchName).emit('match-data', gameData.getSpecificMatch(data.matchName));
	});

	/**
	 * Pauses a match if you are the host
	 *
	 * @param data {email, matchName}
	 */
	socket.on('pause-match', (data) => {
		gameData.pauseMatch(data.matchName);
		io.in('lobby').emit('matches-list', gameData.getMatches());
		io.in(data.matchName).emit('match-data', gameData.getSpecificMatch(data.matchName));
	});

	/**
	 * Stops a match if you are the host
	 *
	 * @param data {email, matchName}
	 */
	socket.on('stop-match', (data) => {
		io.in(data.matchName).emit('match-data', 'exit');
		gameData.deleteMatch(data.matchName);
		io.in('lobby').emit('matches-list', gameData.getMatches());
	});

	/**
	 * Resumes a match if you are the host
	 *
	 * @param data {email, matchName}
	 */
	socket.on('resume-match', (data) => {
		gameData.resumeMatch(data.matchName);
		io.in('lobby').emit('matches-list', gameData.getMatches());
		io.in(data.matchName).emit('match-data', gameData.getSpecificMatch(data.matchName));
	});

	/**
	 * Returns data of a specific match to a specific socket
	 *
	 * @param data {email, matchName}
	 */
	socket.on('get-match-data', (data) => {
		socket.join(data.matchName);
		io.to(socket.id).emit('match-data', gameData.getSpecificMatch(data.matchName));
	});

	/**
	 * Leave a match
	 *
	 * @param data {email, matchName}
	 */
	socket.on('leave-match', (data) => {
		gameData.leaveMatch(data.matchName, data.email);
		io.in('lobby').emit('matches-list', gameData.getMatches());
		io.in(data.matchName).emit('match-data', gameData.getSpecificMatch(data.matchName));
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
		io.in('lobby').emit('matches-list', gameData.getMatches());
	});

	/**
	 * Leaves the lobby
	 *	 */
	socket.on('leave-lobby', () => {
		socket.leave('lobby');
	});
});
