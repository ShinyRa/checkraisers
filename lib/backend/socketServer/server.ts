import { Collection, MongoClient } from 'mongodb';
import { Server } from 'socket.io';

// Localhost
const port = 3001;

const io = new Server(port, {
	cors: {
		origin: '*',
		credentials: true
	}
});

console.log('server started');
type Match = {
	name?: string;
	bigBlind?: number;
	maxPlayers?: number;
	players?: Record<string, Player>;
};

type Player = {
	email: string;
	username: string;
	chips: number;
	profilePicture: string;
};

const matches: Match = {};

io.on('connection', function (socket) {
	io.to(socket.id).emit('matches-list', matches);

	socket.on('new-match', (data) => {
		matches[data.matchName] = {
			name: data.matchName,
			bigBlind: data.bigBlind,
			maxPlayers: data.maxPlayers,
			players: {}
		};
		io.in('lobby').emit('matches-list', matches);
	});

	socket.on('leave-match', (data) => {
		delete matches[data.matchName].players[data.email];
		io.in('lobby').emit('matches-list', matches);
		io.in(data.matchName).emit('match-data', matches[data.matchName]);
	});

	socket.on('join-match', async (data) => {
		const userData = await Database.getProfile(data.email);
		socket.join(data.matchName);
		matches[data.matchName].players[userData['email']] = {
			email: userData['email'],
			username: userData['username'],
			chips: userData['chips'],
			profilePicture: userData['profilePicture']
		};
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

class Database {
	private static client: MongoClient;

	public static getProfile = async (email: string): Promise<unknown> => {
		await this.openDbConnection();
		const db = await this.getCollection('users');
		const user = await db
			.findOne({ email: email }, { projection: { _id: 0, password: 0 } })
			.then((result) => {
				return result ? result : false;
			});
		await this.closeDbConnection();

		return user;
	};

	private static getCollection = async (collection: string): Promise<Collection> => {
		return await this.client.db('local').collection(collection);
	};

	private static openDbConnection = async (): Promise<void> => {
		try {
			this.client = await MongoClient.connect('mongodb://127.0.0.1:27017/');
		} catch (err) {
			console.log(err);
		}
	};

	private static closeDbConnection = async (): Promise<void> => {
		try {
			this.client.close();
		} catch (err) {
			console.log(err);
		}
	};
}
