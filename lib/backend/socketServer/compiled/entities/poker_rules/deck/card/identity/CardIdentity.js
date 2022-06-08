"use strict";
exports.__esModule = true;
exports.CardIdentity = void 0;
var CardSuit_1 = require("./CardSuit");
var CardValue_1 = require("./CardValue");
var CardIdentity = /** @class */ (function () {
    /**
     * Create a new CardIdentity
     */
    function CardIdentity(suit, value) {
        var _this = this;
        /**
         * Pint card details to string.
         *
         * template
         * 	 *value* of *suit*
         * example
         * 	 two of hearts
         *
         * @returns string
         */
        this.print = function () {
            return CardValue_1.CardValue[_this.value].toLowerCase() + ' of ' + CardSuit_1.CardSuit[_this.suit].toLowerCase();
        };
        /**
         * Get value of card
         *
         * @returns CardValue
         */
        this.getValue = function () { return _this.value; };
        /**
         * Get value of card as readable string
         *
         * @returns string
         */
        this.getValueReadable = function () { return CardValue_1.CardValue[_this.value]; };
        /**
         * Get suit of card
         *
         * @returns CardSuit
         */
        this.getSuit = function () { return _this.suit; };
        /**
         * Get suit of card as readalbe string
         *
         * @returns string
         */
        this.getSuitReadable = function () { return CardSuit_1.CardSuit[_this.suit]; };
        this.value = value;
        this.suit = suit;
    }
    /**
     * Create a CardIdentity via string template
     *
     * Template:
     *  *suit**value*
     * Example:
     *
     *
     * @param template string
     *
     * @returns CardIdentity | null
     */
    CardIdentity.fromTemplate = function (template) {
        if (template.length > 3 || template.length < 1) {
            return null;
        }
        var _a = [template.slice(0, 1), template.slice(1)], templateSuit = _a[0], templateValue = _a[1];
        var suit;
        var value;
        switch (templateSuit) {
            case '♠':
                suit = CardSuit_1.CardSuit.SPADES;
                break;
            case '♣':
                suit = CardSuit_1.CardSuit.CLUBS;
                break;
            case '♥':
                suit = CardSuit_1.CardSuit.HEARTS;
                break;
            case '♦':
                suit = CardSuit_1.CardSuit.DIAMONDS;
                break;
        }
        if (isNaN(Number(templateValue))) {
            switch (templateValue) {
                case 'J':
                    value = CardValue_1.CardValue.JACK;
                    break;
                case 'Q':
                    value = CardValue_1.CardValue.QUEEN;
                    break;
                case 'K':
                    value = CardValue_1.CardValue.KING;
                    break;
                case 'A':
                    value = CardValue_1.CardValue.ACE;
                    break;
            }
        }
        else {
            value = Number(templateValue);
        }
        return new CardIdentity(suit, value);
    };
    return CardIdentity;
}());
exports.CardIdentity = CardIdentity;
