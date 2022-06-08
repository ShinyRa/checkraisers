"use strict";
exports.__esModule = true;
var CardState_1 = require("./state/CardState");
var CardIdentity_1 = require("./identity/CardIdentity");
var PlayingCard = /** @class */ (function () {
    /**
     * Create a new playingcard
     *
     * @param template template to make a card
     * @param state CardState enum, default hidden
     */
    function PlayingCard(identity, state) {
        var _this = this;
        if (state === void 0) { state = CardState_1.CardState.HIDDEN; }
        /**
         * Flip card from hidden to revealed state or vice versa.
         *
         * @returns self
         */
        this.flip = function () {
            if (_this.state === CardState_1.CardState.HIDDEN) {
                _this.state = CardState_1.CardState.REVEALED;
                _this.setAsKnown();
            }
            else if (_this.state === CardState_1.CardState.REVEALED) {
                _this.state = CardState_1.CardState.HIDDEN;
            }
            return _this;
        };
        /**
         * Set card state to revealed.
         *
         * @returns void
         */
        this.reveal = function () {
            _this.state = CardState_1.CardState.REVEALED;
            _this.setAsKnown();
        };
        /**
         * If card is currently revealed.
         *
         * @returns boolean
         */
        this.isRevealed = function () { return _this.state === CardState_1.CardState.REVEALED; };
        /**
         * If card is known.
         *
         * @returns boolean
         */
        this.isKnown = function () { return _this.known; };
        /**
         * Set known
         *
         * @returns
         */
        this.setAsKnown = function () {
            _this.known = true;
        };
        /**
         * Get asset name of card if it is known.
         *
         * template
         * 	 *value*_of_*suit*.png
         * example
         * 	 two_of_hearts.png
         *
         * @returns string
         */
        this.assetName = function () {
            return _this.isKnown()
                ? _this.getValueReadable().toLowerCase() + "_of_" + _this.getSuitReadable().toLowerCase() + ".png"
                : "Cardback.png";
        };
        /**
         * Print card details to string.
         *
         * template
         * 	 *value* of *suit*
         * example
         * 	 two of hearts
         *
         * @returns string
         */
        this.print = function () { return _this.identity.print(); };
        /**
         * Get readable value of card
         *
         * @returns string
         */
        this.getValueReadable = function () { return _this.identity.getValueReadable(); };
        /**
         * Get actual value of card
         *
         * @returns CardValue
         */
        this.getValue = function () { return _this.identity.getValue(); };
        /**
         * Get readable suit of card
         *
         * @returns string
         */
        this.getSuitReadable = function () { return _this.identity.getSuitReadable(); };
        /**
         * Get actual suit of card
         *
         * @returns CardSuit
         */
        this.getSuit = function () { return _this.identity.getSuit(); };
        /**
         * Compare card value to other card value
         *
         * @param playingcard PlayingCard
         *
         * @returns number
         */
        this.compareTo = function (playingcard) {
            return _this.getValue() === playingcard.getValue()
                ? 0
                : _this.getValue() - playingcard.getValue();
        };
        this.identity =
            identity instanceof CardIdentity_1.CardIdentity ? identity : CardIdentity_1.CardIdentity.fromTemplate(identity);
        this.state = state ? state : CardState_1.CardState.REVEALED;
        this.known = this.state === CardState_1.CardState.REVEALED;
    }
    return PlayingCard;
}());
exports["default"] = PlayingCard;
