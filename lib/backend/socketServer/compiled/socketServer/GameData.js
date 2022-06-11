"use strict";
exports.__esModule = true;
var ActionStack_1 = require("../entities/poker_rules/round/ActionStack");
var Phase_1 = require("../entities/poker_rules/round/Phase");
var deckAPI_1 = require("../entities/poker_rules/deck/deckAPI");
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
                    currentPlayerMove: '',
                    phase: Phase_1.Phase.PRE_FLOP,
                    roundsPlayed: 0,
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
            return _this.matches;
        };
        this.matches = {};
    }
    return GameData;
}());
exports["default"] = GameData;
