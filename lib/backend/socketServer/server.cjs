'use strict';
var __awaiter =
	(this && this.__awaiter) ||
	function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function (resolve) {
						resolve(value);
				  });
		}
		return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator['throw'](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
var __generator =
	(this && this.__generator) ||
	function (thisArg, body) {
		var _ = {
				label: 0,
				sent: function () {
					if (t[0] & 1) throw t[1];
					return t[1];
				},
				trys: [],
				ops: []
			},
			f,
			y,
			t,
			g;
		return (
			(g = { next: verb(0), throw: verb(1), return: verb(2) }),
			typeof Symbol === 'function' &&
				(g[Symbol.iterator] = function () {
					return this;
				}),
			g
		);
		function verb(n) {
			return function (v) {
				return step([n, v]);
			};
		}
		function step(op) {
			if (f) throw new TypeError('Generator is already executing.');
			while (_)
				try {
					if (
						((f = 1),
						y &&
							(t =
								op[0] & 2
									? y['return']
									: op[0]
									? y['throw'] || ((t = y['return']) && t.call(y), 0)
									: y.next) &&
							!(t = t.call(y, op[1])).done)
					)
						return t;
					if (((y = 0), t)) op = [op[0] & 2, t.value];
					switch (op[0]) {
						case 0:
						case 1:
							t = op;
							break;
						case 4:
							_.label++;
							return { value: op[1], done: false };
						case 5:
							_.label++;
							y = op[1];
							op = [0];
							continue;
						case 7:
							op = _.ops.pop();
							_.trys.pop();
							continue;
						default:
							if (
								!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
								(op[0] === 6 || op[0] === 2)
							) {
								_ = 0;
								continue;
							}
							if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
								_.label = op[1];
								break;
							}
							if (op[0] === 6 && _.label < t[1]) {
								_.label = t[1];
								t = op;
								break;
							}
							if (t && _.label < t[2]) {
								_.label = t[2];
								_.ops.push(op);
								break;
							}
							if (t[2]) _.ops.pop();
							_.trys.pop();
							continue;
					}
					op = body.call(thisArg, _);
				} catch (e) {
					op = [6, e];
					y = 0;
				} finally {
					f = t = 0;
				}
			if (op[0] & 5) throw op[1];
			return { value: op[0] ? op[1] : void 0, done: true };
		}
	};
exports.__esModule = true;
var mongodb_1 = require('mongodb');
var socket_io_1 = require('socket.io');
// Localhost
var port = 3001;
var io = new socket_io_1.Server(port, {
	cors: {
		origin: '*',
		credentials: true
	}
});
console.log('server started');
var matches = {};
io.on('connection', function (socket) {
	var _this = this;
	io.to(socket.id).emit('matches-list', matches);
	socket.on('new-match', function (data) {
		matches[data.matchName] = {
			name: data.matchName,
			bigBlind: data.bigBlind,
			maxPlayers: data.maxPlayers,
			players: {}
		};
		console.log('new: ', matches[data.matchName]);
		io['in']('lobby').emit('matches-list', matches);
	});
	socket.on('leave-match', function (data) {
		delete matches[data.matchName].players[data.email];
		io['in']('lobby').emit('matches-list', matches);
		io['in'](data.matchName).emit('match-data', matches[data.matchName]);
	});
	socket.on('join-match', function (data) {
		return __awaiter(_this, void 0, void 0, function () {
			var userData;
			return __generator(this, function (_a) {
				switch (_a.label) {
					case 0:
						return [4 /*yield*/, Database.getProfile(data.email)];
					case 1:
						userData = _a.sent();
						socket.join(data.matchName);
						console.log('join (match): ', data.matchName);
						matches[data.matchName].players[userData['email']] = {
							email: userData['email'],
							username: userData['username'],
							chips: userData['chips'],
							profilePicture: userData['profilePicture']
						};
						io['in']('lobby').emit('matches-list', matches);
						io['in'](data.matchName).emit('match-data', matches[data.matchName]);
						return [2 /*return*/];
				}
			});
		});
	});
	socket.on('join-lobby', function () {
		socket.join('lobby');
		io['in']('lobby').emit('matches-list', matches);
	});
	socket.on('leave-lobby', function () {
		socket.disconnect();
	});
});
var Database = /** @class */ (function () {
	function Database() {}
	var _a;
	_a = Database;
	Database.getProfile = function (email) {
		return __awaiter(void 0, void 0, void 0, function () {
			var db, user;
			return __generator(_a, function (_b) {
				switch (_b.label) {
					case 0:
						return [4 /*yield*/, this.openDbConnection()];
					case 1:
						_b.sent();
						return [4 /*yield*/, this.getCollection('users')];
					case 2:
						db = _b.sent();
						return [
							4 /*yield*/,
							db
								.findOne({ email: email }, { projection: { _id: 0, password: 0 } })
								.then(function (result) {
									return result ? result : false;
								})
						];
					case 3:
						user = _b.sent();
						return [4 /*yield*/, this.closeDbConnection()];
					case 4:
						_b.sent();
						return [2 /*return*/, user];
				}
			});
		});
	};
	Database.getCollection = function (collection) {
		return __awaiter(void 0, void 0, void 0, function () {
			return __generator(_a, function (_b) {
				switch (_b.label) {
					case 0:
						return [4 /*yield*/, this.client.db('local').collection(collection)];
					case 1:
						return [2 /*return*/, _b.sent()];
				}
			});
		});
	};
	Database.openDbConnection = function () {
		return __awaiter(void 0, void 0, void 0, function () {
			var _b, err_1;
			return __generator(_a, function (_c) {
				switch (_c.label) {
					case 0:
						_c.trys.push([0, 2, , 3]);
						_b = this;
						return [4 /*yield*/, mongodb_1.MongoClient.connect('mongodb://127.0.0.1:27017/')];
					case 1:
						_b.client = _c.sent();
						return [3 /*break*/, 3];
					case 2:
						err_1 = _c.sent();
						console.log(err_1);
						return [3 /*break*/, 3];
					case 3:
						return [2 /*return*/];
				}
			});
		});
	};
	Database.closeDbConnection = function () {
		return __awaiter(void 0, void 0, void 0, function () {
			return __generator(_a, function (_b) {
				try {
					this.client.close();
				} catch (err) {
					console.log(err);
				}
				return [2 /*return*/];
			});
		});
	};
	return Database;
})();
