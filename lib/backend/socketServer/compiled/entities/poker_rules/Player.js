"use strict";
exports.__esModule = true;
var PlayerHand_1 = require("./hand/PlayerHand");
var Player = /** @class */ (function () {
    function Player(email, username, profilePicture, totalChips, hand) {
        this.email = email;
        this.username = username;
        this.profilePicture = profilePicture;
        this.totalChips = totalChips;
        this.hand = hand ? hand : new PlayerHand_1.PlayerHand();
    }
    Player.prototype.canTakeAction = function (action) {
        return this.totalChips >= action.chips;
    };
    Player.prototype.takeAction = function (action) {
        this.totalChips -= action.chips;
    };
    return Player;
}());
exports["default"] = Player;
