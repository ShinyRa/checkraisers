"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.ActionStack = void 0;
var PlayerAction_1 = require("./action/PlayerAction");
var PlayerActionEnum_1 = require("./action/PlayerActionEnum");
var ActionStack = /** @class */ (function () {
    /**
     * Create new ActionStack
     *
     * @param players
     */
    function ActionStack(players) {
        var _this = this;
        this.players = players;
        this.actions = [];
        __spreadArrays(new Array(this.players.length)).forEach(function (_, i) {
            _this.actions.push(new PlayerAction_1.PlayerAction(_this.players[i]));
        });
        this.stakes = __spreadArrays(new Array(this.players.length)).fill(0);
        this.foldedMask = __spreadArrays(new Array(this.players.length)).fill(false);
    }
    /**
     * get the email of the player whose turn it is.
     *
     */
    ActionStack.prototype.currentPlayerTurn = function () {
        var playerTurn;
        this.actions.forEach(function (action) {
            console.log(action);
            if (action.action === PlayerActionEnum_1.PlayerActionEnum.PENDING) {
                playerTurn = action.player.email;
                return;
            }
        });
        return playerTurn;
    };
    /**
     * Find the index of player in players array
     *
     * @param number
     */
    ActionStack.prototype.findPlayerIndex = function (player) {
        return this.players.indexOf(player);
    };
    /**
     * Push player action to the stack
     *
     * @param action PlayerAction
     */
    ActionStack.prototype.push = function (player, actionEnum, chips) {
        var _this = this;
        var pendingTurns = [];
        var playerIndex = this.findPlayerIndex(player);
        // If player participates in this action stack
        if (!this.players.includes(player)) {
            return;
        }
        // If raised and no chips are provided
        if (actionEnum === PlayerActionEnum_1.PlayerActionEnum.RAISE && chips <= 0) {
            return;
        }
        if (actionEnum === PlayerActionEnum_1.PlayerActionEnum.FOLD) {
            this.foldedMask[playerIndex] = true;
        }
        if (actionEnum === PlayerActionEnum_1.PlayerActionEnum.CALL) {
            chips = this.findCallForPlayer(player);
            this.stakes[playerIndex] += chips;
        }
        if (actionEnum === PlayerActionEnum_1.PlayerActionEnum.ALLIN || actionEnum === PlayerActionEnum_1.PlayerActionEnum.RAISE) {
            chips =
                actionEnum === PlayerActionEnum_1.PlayerActionEnum.ALLIN
                    ? // I don't like the TSC compiler.
                        parseInt(player.totalChips)
                    : chips;
            this.stakes[playerIndex] += chips;
            this.players.map(function (p) {
                if (_this.hasActionsRemaining(p) && player != p) {
                    pendingTurns.push(new PlayerAction_1.PlayerAction(p));
                }
            });
        }
        this.actions.push(new PlayerAction_1.PlayerAction(player, actionEnum, chips));
        pendingTurns.map(function (action) { return _this.actions.push(action); });
    };
    ActionStack.prototype.findCallForPlayer = function (player) {
        var _this = this;
        var playerIndex = this.findPlayerIndex(player);
        var myStakes = this.stakes[playerIndex];
        var highestBid = Math.max.apply(Math, this.stakes.filter(function (p, index) { return index != playerIndex && !_this.foldedMask[index]; }));
        var diff = myStakes - highestBid;
        return diff < 0 ? Math.abs(diff) : 0;
    };
    /**
     * If the player has actions remaining
     *
     * @param player Player
     *
     * @returns boolean
     */
    ActionStack.prototype.hasActionsRemaining = function (player) {
        return (this.actions.filter(function (action) {
            return (action.player === player && action.getType() !== PlayerActionEnum_1.PlayerActionEnum.ALLIN) ||
                action.getType() === PlayerActionEnum_1.PlayerActionEnum.FOLD;
        }).length > 0);
    };
    /**
     * Get number of actions on the stack
     */
    ActionStack.prototype.length = function () {
        return this.actions.length;
    };
    /**
     * Get combined potsize of the stack
     */
    ActionStack.prototype.potSize = function () {
        return this.stakes.reduce(function (prev, curr) { return prev + curr; }, 0);
    };
    return ActionStack;
}());
exports.ActionStack = ActionStack;