"use strict";
exports.__esModule = true;
exports.PlayerAction = void 0;
var PlayerActionEnum_1 = require("./PlayerActionEnum");
var PlayerAction = /** @class */ (function () {
    /**
     * Create new PlayerAction
     *
     * @param player Player
     * @param action PlayerActionEnum
     * @param chips  number
     */
    function PlayerAction(player, action, chips) {
        this.player = player;
        this.action = action !== null && action !== void 0 ? action : PlayerActionEnum_1.PlayerActionEnum.PENDING;
        this.chips = chips !== null && chips !== void 0 ? chips : 0;
        if (action === PlayerActionEnum_1.PlayerActionEnum.ALLIN) {
            this.chips = player.totalChips;
        }
    }
    /**
     * Print player action as string
     *
     * @returns string
     */
    PlayerAction.prototype.print = function () {
        return "PlayerAction: " + this.getType() + ", with chips: " + this.chips;
    };
    /**
     * Get type of PlayerAction
     *
     * @returns PlayerActionEnum
     */
    PlayerAction.prototype.getType = function () {
        return this.action;
    };
    /**
     * If PlayerAction is resolved
     *
     * @returns
     */
    PlayerAction.prototype.isResolved = function () {
        return this.action !== PlayerActionEnum_1.PlayerActionEnum.PENDING;
    };
    return PlayerAction;
}());
exports.PlayerAction = PlayerAction;
