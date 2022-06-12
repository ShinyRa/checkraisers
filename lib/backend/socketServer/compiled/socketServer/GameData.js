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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var ActionStack_1 = require("../entities/poker_rules/round/ActionStack");
var Phase_1 = require("../entities/poker_rules/round/Phase");
var evaluationAPI_1 = require("../entities/poker_rules/round/evaluationAPI");
var deckAPI_1 = require("../entities/poker_rules/deck/deckAPI");
var PlayerDAO_1 = require("../dao/user/PlayerDAO");
var GameData = /** @class */ (function () {
    function GameData() {
        var _this = this;
        this.roundMessage = {
            started: 'The round has started!',
            paused: 'The round has been paused...',
            resumed: 'The round has been resumed!'
        };
        /**
         * Create a new match;
         *
         * @param host
         * @param name
         * @param bigBlind
         * @param maxPlayers
         */
        this.newMatch = function (host, matchName, bigBlind, maxPlayers) {
            if (!_this.getSpecificMatch[matchName]) {
                var rounds = {
                    deck: {},
                    communityCards: [],
                    winner: null,
                    currentPlayerMove: '',
                    phase: Phase_1.Phase.PRE_FLOP,
                    actionStack: null,
                    potSize: 0
                };
                _this.matches[matchName] = {
                    started: false,
                    host: host,
                    message: null,
                    name: matchName,
                    bigBlind: bigBlind,
                    maxPlayers: maxPlayers,
                    rounds: rounds,
                    players: []
                };
                return true;
            }
            else {
                return false;
            }
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
        this.drawCommunityCards = function (match) {
            if (match.rounds.communityCards.length < 5) {
                var newCard = match.rounds.deck.draw();
                newCard.reveal();
                match.rounds.communityCards = __spreadArrays(match.rounds.communityCards, [newCard]);
                return match;
            }
            return match;
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
        this.resumeMatch = function (matchName) {
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
        // playerAction = async (
        // 	email: string,
        // 	matchName: string,
        // 	action: PlayerActionEnum,
        // 	chips?: number
        // ): Promise<boolean> => {
        // 	const specificMatch = this.getSpecificMatch(matchName);
        // 	const player = this.findPlayer(matchName, email);
        // 	if (specificMatch && player) {
        // 		specificMatch.rounds.actionStack.push(player, action, chips);
        // 		specificMatch.rounds.potSize = specificMatch.rounds.actionStack.potSize();
        // 		if (specificMatch.rounds.actionStack.currentPlayerTurn()) {
        // 			specificMatch.rounds.currentPlayerMove =
        // 				specificMatch.rounds.actionStack.currentPlayerTurn();
        // 			this.matches[matchName] = specificMatch;
        // 		} else {
        // 			delete this.matches[matchName];
        // 			this.matches[matchName] = await this.newPhase(specificMatch);
        // 		}
        // 		return true;
        // 	} else {
        // 		return false;
        // 	}
        // };
        this.playerAction = function (email, matchName, action, chips) { return __awaiter(_this, void 0, void 0, function () {
            var specificMatch, player, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        specificMatch = this.getSpecificMatch(matchName);
                        player = this.findPlayer(matchName, email);
                        if (!(specificMatch && player)) return [3 /*break*/, 4];
                        //gaat alles goed in de actionstack?
                        chips
                            ? specificMatch.rounds.actionStack.push(player, action, chips)
                            : specificMatch.rounds.actionStack.push(player, action);
                        specificMatch.rounds.potSize = specificMatch.rounds.actionStack.potSize();
                        if (!specificMatch.rounds.actionStack.currentPlayerTurn()) return [3 /*break*/, 1];
                        specificMatch.rounds.currentPlayerMove =
                            specificMatch.rounds.actionStack.currentPlayerTurn();
                        this.matches[matchName] = specificMatch;
                        return [3 /*break*/, 3];
                    case 1:
                        delete this.matches[matchName];
                        _a = this.matches;
                        _b = matchName;
                        return [4 /*yield*/, this.newPhase(specificMatch)];
                    case 2:
                        _a[_b] = _c.sent();
                        _c.label = 3;
                    case 3: return [2 /*return*/, true];
                    case 4: return [2 /*return*/, false];
                }
            });
        }); };
        //Dit werkt
        this.replay = function (matchName) { return __awaiter(_this, void 0, void 0, function () {
            var match;
            return __generator(this, function (_a) {
                match = this.getSpecificMatch(matchName);
                if (match && match.rounds.phase === Phase_1.Phase.EVALUATE) {
                    this.matches[matchName] = this.newRound(match);
                }
                return [2 /*return*/];
            });
        }); };
        //Hier kan een bug in zitten.
        this.updatePlayerChips = function (match) { return __awaiter(_this, void 0, void 0, function () {
            var i, playerIndex, chipsSpent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < match.players.length)) return [3 /*break*/, 4];
                        playerIndex = match.rounds.actionStack.findPlayerIndex(match.players[i]);
                        chipsSpent = match.rounds.actionStack.stakes[playerIndex];
                        match.players[i].totalChips = match.players[i].totalChips - chipsSpent;
                        return [4 /*yield*/, this.playerDAO.updateChipAmount(match.players[i].totalChips, match.players[i].email)];
                    case 2:
                        _a.sent();
                        if (match.players[i].email === match.rounds.winner['winner'].email) {
                            this.playerDAO.updateChipAmount(match.players[i].totalChips + match.rounds.potSize, match.players[i].email);
                            match.players[i].totalChips + match.rounds.potSize;
                        }
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, match];
                }
            });
        }); };
        //Dit werkt.
        this.newPhase = function (match) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(match.rounds.phase === Phase_1.Phase.RIVER)) return [3 /*break*/, 2];
                        match.rounds.phase = Phase_1.Phase.EVALUATE;
                        match.rounds.currentPlayerMove = '';
                        match.rounds.winner = evaluationAPI_1.evaluationAPI.evaluate(match.players, match.rounds.communityCards);
                        return [4 /*yield*/, this.updatePlayerChips(match)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        match.rounds.phase += 1;
                        match.rounds.actionStack.nextPhase();
                        match.rounds.currentPlayerMove = match.rounds.actionStack.currentPlayerTurn();
                        if (match.rounds.phase === Phase_1.Phase.FLOP) {
                            this.drawCommunityCards(match);
                            this.drawCommunityCards(match);
                            this.drawCommunityCards(match);
                        }
                        else {
                            this.drawCommunityCards(match);
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/, match];
                }
            });
        }); };
        // Dit werkt.
        this.newRound = function (match) {
            delete _this.matches[match.name];
            _this.newMatch(match.host, match.name, match.bigBlind, match.maxPlayers);
            var newMatch = _this.getSpecificMatch(match.name);
            if (newMatch) {
                newMatch.rounds.deck = _this.createDeckforMatch(newMatch);
                match.players.forEach(function (player) {
                    player.hand.cards = [];
                });
                newMatch.players = _this.handOutCards(match.players, newMatch.rounds.deck);
                newMatch.rounds.actionStack = new ActionStack_1.ActionStack(match.players);
                newMatch.rounds.phase = Phase_1.Phase.PRE_FLOP;
                newMatch.message = _this.roundMessage.started;
                newMatch.rounds.potSize = 0;
                newMatch.rounds.communityCards = [];
                newMatch.rounds.currentPlayerMove = newMatch.rounds.actionStack.currentPlayerTurn();
                newMatch.started = true;
                return newMatch;
            }
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
            var specificMatch = _this.getSpecificMatch(matchName);
            if (specificMatch) {
                for (var i = 0; i < specificMatch.players.length; i++) {
                    if (specificMatch.players[i].email === email) {
                        return specificMatch.players[i];
                    }
                }
                return false;
            }
            else {
                return false;
            }
        };
        /**
         * Draw cards from the provided deck and give them to the players.
         *
         * @param players
         * @param deckData
         */
        this.handOutCards = function (players, deck) {
            players.forEach(function (player) {
                [1, 2].forEach(function () { return player.hand.deal(deck.draw()); });
            });
            return players;
        };
        /**
         * Uses the deckAPI to create a new deck. This deck is given to a specific match
         *
         * @param specificMatch
         */
        this.createDeckforMatch = function (specificMatch) {
            specificMatch.rounds.deck = deckAPI_1.deckAPI.shuffleDeck().deck;
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
            return _this.matches;
        };
        this.matches = {};
        this.playerDAO = new PlayerDAO_1["default"]();
    }
    return GameData;
}());
exports["default"] = GameData;
