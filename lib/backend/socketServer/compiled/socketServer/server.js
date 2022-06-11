"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var socket_io_1 = require("socket.io");
var UserDAO_1 = require("../dao/user/UserDAO");
var Player_1 = require("../entities/poker_rules/Player");
// Localhost
var port = 3001;
var io = new socket_io_1.Server(port, {
    cors: {
        origin: '*',
        credentials: true
    }
});
console.log('server started');
var gameData;
var userDAO = new UserDAO_1["default"]();
io.on('connection', function (socket) {
    var _this = this;
    /**
     * Creates a new match on the server
     */
    socket.on('new-match', function (data) {
        gameData = new GameData(data.host, data.matchName, data.bigBlind, data.maxPlayers);
        io["in"]('lobby').emit('matches-list', gameData.getMatches());
    });
    /**
     * Starts a created match
     *
     * @param data {email, matchName}
     */
    socket.on('start-match', function (data) {
        gameData.startMatch(data.matchName);
        io["in"]('lobby').emit('matches-list', gameData.getMatches());
        io["in"](data.matchName).emit('match-data', gameData.getSpecificMatch(data.matchName));
    });
    /**
     * Joins a match
     *
     * @param data {email, matchName}
     */
    socket.on('join-match', function (data) { return __awaiter(_this, void 0, void 0, function () {
        var userData, newPlayer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, userDAO.getProfile(data.email)];
                case 1:
                    userData = _a.sent();
                    //is this if statement even necessary anymore? The "get-match-data" handles this use case now.
                    if ((gameData.findPlayer(data.matchName, data.email), data.email)) {
                        socket.leave('lobby');
                        socket.join(data.matchName);
                        newPlayer = new Player_1["default"](userData['email'], userData['username'], userData['profilePicture'], userData['chips']);
                        gameData.addPlayerToMatch(data.matchName, newPlayer);
                        io["in"]('lobby').emit('matches-list', gameData.getMatches());
                        io["in"](data.matchName).emit('match-data', gameData.getSpecificMatch(data.matchName));
                    }
                    else {
                        io.to(socket.id).emit('match-data', gameData.getSpecificMatch(data.matchName));
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    socket.on('player-action', function (data) {
        gameData.playerAction(data.email, data.matchName, data.action.playerAction, data.action.chips);
        io["in"](data.matchName).emit('match-data', gameData.getSpecificMatch(data.matchName));
    });
    /**
     * Pauses a match if you are the host
     *
     * @param data {email, matchName}
     */
    socket.on('pause-match', function (data) {
        gameData.pauseMatch(data.matchName);
        io["in"]('lobby').emit('matches-list', gameData.getMatches());
        io["in"](data.matchName).emit('match-data', gameData.getSpecificMatch(data.matchName));
    });
    /**
     * Stops a match if you are the host
     *
     * @param data {email, matchName}
     */
    socket.on('stop-match', function (data) {
        io["in"](data.matchName).emit('match-data', 'exit');
        gameData.deleteMatch(data.matchName);
        io["in"]('lobby').emit('matches-list', gameData.getMatches());
    });
    /**
     * Resumes a match if you are the host
     *
     * @param data {email, matchName}
     */
    socket.on('resume-match', function (data) {
        gameData.pauseMatch(data.matchName);
        io["in"]('lobby').emit('matches-list', gameData.getMatches());
        io["in"](data.matchName).emit('match-data', gameData.getSpecificMatch(data.matchName));
    });
    /**
     * Returns data of a specific match to a specific socket
     *
     * @param data {email, matchName}
     */
    socket.on('get-match-data', function (data) {
        socket.join(data.matchName);
        io.to(socket.id).emit('match-data', gameData.getSpecificMatch(data.matchName));
    });
    /**
     * Leave a match
     *
     * @param data {email, matchName}
     */
    socket.on('leave-match', function (data) {
        gameData.leaveMatch(data.matchName, data.email);
        io["in"]('lobby').emit('matches-list', gameData.getMatches());
        io["in"](data.matchName).emit('match-data', gameData.getSpecificMatch(data.matchName));
    });
    /**
     * Disconnect the socket
     *
     */
    socket.on('disconnect', function () {
        console.log('disconnected user: ', socket.id);
    });
    /**
     * Join a lobby, a room where you get information about the current matches being played.
     *
     */
    socket.on('join-lobby', function () {
        socket.join('lobby');
        io["in"]('lobby').emit('matches-list', gameData.getMatches());
    });
    /**
     * Leaves the lobby
     *	 */
    socket.on('leave-lobby', function () {
        socket.leave('lobby');
    });
});
var deckAPI_1 = require("../entities/poker_rules/deck/deckAPI");
var ActionStack_1 = require("../entities/poker_rules/round/ActionStack");
var Phase_1 = require("../entities/poker_rules/round/Phase");
var GameData = /** @class */ (function () {
    /**
     * Create new match object.
     *
     * @param host
     * @param name
     * @param bigBlind
     * @param maxPlayers
     */
    function GameData(host, matchName, bigBlind, maxPlayers) {
        var _this = this;
        this.roundMessage = {
            started: 'The round has started!',
            paused: 'The round has been paused...',
            resumed: 'The round has been resumed!'
        };
        /**
         * Adds data to the previously created match. If "MatchData" returns no match object, the function return false.
         *
         * TODO check if email provided is the host of match
         *
         * @param matchName
         */
        this.startMatch = function (matchName) {
            var specificMatch = _this.getSpecificMatch(matchName);
            if (specificMatch) {
                specificMatch.message = _this.roundMessage.started;
                specificMatch.started = true;
                specificMatch.rounds.actionStack = new ActionStack_1.ActionStack(specificMatch.players);
                specificMatch.rounds.deck = _this.createDeckforMatch(specificMatch);
                specificMatch.rounds.currentPlayerMove = specificMatch.rounds.actionStack.currentPlayerTurn();
                specificMatch.players = _this.handOutCards(specificMatch.players, specificMatch.rounds.deck);
                _this.matches[matchName] = specificMatch;
                return true;
            }
            else {
                return false;
            }
        };
        this.deleteMatch = function (matchName) {
            var specificMatch = _this.getSpecificMatch(matchName);
            if (specificMatch) {
                delete _this.matches[matchName];
            }
            else {
                return false;
            }
        };
        this.pauseMatch = function (matchName) {
            var specificMatch = _this.getSpecificMatch(matchName);
            if (specificMatch) {
                specificMatch.message = _this.roundMessage.paused;
                _this.matches[matchName] = specificMatch;
            }
            else {
                return false;
            }
        };
        this.ResumeMatch = function (matchName) {
            var specificMatch = _this.getSpecificMatch(matchName);
            if (specificMatch) {
                specificMatch.message = _this.roundMessage.resumed;
                _this.matches[matchName] = specificMatch;
            }
            else {
                return false;
            }
        };
        this.addPlayerToMatch = function (matchName, player) {
            var specificMatch = _this.getSpecificMatch(matchName);
            if (specificMatch) {
                specificMatch.players.push(player);
                _this.matches[matchName] = specificMatch;
                return true;
            }
            else {
                return false;
            }
        };
        this.playerAction = function (email, matchName, action, chips) {
            var specificMatch = _this.getSpecificMatch(matchName);
            var player = _this.findPlayer(matchName, email);
            if (specificMatch && player) {
                specificMatch.rounds.actionStack.push(player, action, chips);
                specificMatch.rounds.potSize = specificMatch.rounds.actionStack.potSize();
                if (specificMatch.rounds.actionStack.currentPlayerTurn()) {
                    specificMatch.rounds.currentPlayerMove =
                        specificMatch.rounds.actionStack.currentPlayerTurn();
                }
                else {
                    if (specificMatch.rounds.phase !== 4) {
                        specificMatch = _this.newPhase(specificMatch);
                    }
                    else {
                        specificMatch = _this.newRound(specificMatch);
                    }
                }
                _this.matches[matchName] = specificMatch;
                return true;
            }
            else {
                return false;
            }
        };
        this.newPhase = function (match) {
            if (match.rounds.phase === Phase_1.Phase.SHOWDOWN) {
                match.rounds.phase = Phase_1.Phase.PRE_FLOP;
            }
            else {
                match.rounds.phase += 1;
            }
            match.rounds.actionStack.nextPhase();
            match.rounds.currentPlayerMove = match.rounds.actionStack.currentPlayerTurn();
            return match;
        };
        this.newRound = function (match) {
            match.rounds.actionStack = new ActionStack_1.ActionStack(match.players);
            match.rounds.phase = Phase_1.Phase.PRE_FLOP;
            match.rounds.potSize = 0;
            match.rounds.currentPlayerMove = match.rounds.actionStack.currentPlayerTurn();
            return match;
        };
        this.leaveMatch = function (matchName, email) {
            var specificMatch = _this.getSpecificMatch(matchName);
            if (specificMatch) {
                for (var i = 0; i < specificMatch.players.length; i++) {
                    if (specificMatch.players[i].email === email) {
                        specificMatch.players.splice(i, 1);
                        _this.matches[matchName] = specificMatch;
                        return true;
                    }
                }
                return false;
            }
            else {
                return false;
            }
        };
        this.findPlayer = function (matchName, email) {
            var res = false;
            var specificMatch = _this.getSpecificMatch(matchName);
            if (specificMatch) {
                specificMatch.players.forEach(function (player) {
                    if (player.email === email)
                        res = player;
                });
            }
            else {
                return false;
            }
            return res;
        };
        /**
         * Draw cards from the provided deck and give them to the players.
         *
         * @param players
         * @param deckData
         */
        this.handOutCards = function (players, deckData) {
            players.forEach(function (player) {
                [1, 2].forEach(function () { return player.hand.deal(deckData.deck.draw()); });
            });
            return players;
        };
        /**
         * Uses the deckAPI to create a new deck. This deck is given to a specific match
         *
         * @param specificMatch
         */
        this.createDeckforMatch = function (specificMatch) {
            specificMatch.rounds.deck = deckAPI_1.deckAPI.shuffleDeck();
            return specificMatch.rounds.deck;
        };
        /**
         * Return a specific match that corresponds with the given "MatchName". If no results, return false.
         *
         * @param specificMatch
         */
        this.getSpecificMatch = function (matchName) {
            var specificMatch = _this.matches[matchName];
            if (specificMatch) {
                return specificMatch;
            }
            else {
                return false;
            }
        };
        /**
         * Gets the Match object.
         *
         * @param specificMatch
         */
        this.getMatches = function () {
            if (_this.matches) {
                return _this.matches;
            }
            else {
                return {};
            }
        };
        var rounds = {
            deck: {},
            currentPlayerMove: '',
            phase: Phase_1.Phase.PRE_FLOP,
            roundsPlayed: 0,
            actionStack: null,
            potSize: 0
        };
        this.matches = {
            started: false,
            host: host,
            message: null,
            name: matchName,
            bigBlind: bigBlind,
            maxPlayers: maxPlayers,
            rounds: rounds,
            players: []
        };
    }
    return GameData;
}());
exports["default"] = GameData;
