"use strict";
exports.__esModule = true;
var CardIdentity_1 = require("./card/identity/CardIdentity");
var CardSuit_1 = require("./card/identity/CardSuit");
var CardValue_1 = require("./card/identity/CardValue");
var PlayingCard_1 = require("./card/PlayingCard");
var CardDeck = /** @class */ (function () {
    /**
     * Create new card deck.
     */
    function CardDeck() {
        var _this = this;
        /**
         * Populate deck with 52 playingcards.
         *
         * @returns self
         */
        this.populate = function () {
            var suits = Object.values(CardSuit_1.CardSuit).filter(function (suit) { return isNaN(Number(suit)); });
            var values = Object.values(CardValue_1.CardValue).filter(function (value) { return isNaN(Number(value)); });
            suits.forEach(function (suit) {
                values.forEach(function (value) {
                    return _this.cards.push(new PlayingCard_1["default"](new CardIdentity_1.CardIdentity(CardSuit_1.CardSuit[suit], CardValue_1.CardValue[value])));
                });
            });
            return _this;
        };
        /**
         * Shuffle deck.
         *
         * @returns self
         */
        this.shuffle = function () {
            // Sort array semi-randomly
            [1, 2, 3, 4, 5].forEach(function () {
                _this.cards.sort(function () { return 0.5 - Math.random(); });
            });
            return _this;
        };
        /**
         * Draw card from deck.
         *
         * @returns PlayingCard | undefined
         */
        this.draw = function () { return _this.cards.pop(); };
        /**
         * Peek next card in deck.
         *
         * @returns PlayingCard | undefined
         */
        this.peek = function () { return _this.cards[_this.cards.length - 1]; };
        /**
         * If deck is empty.
         *
         * @returns boolean
         */
        this.isEmpty = function () { return _this.cards.length == 0; };
        /**
         * Print deck to string.
         *
         * @returns string
         */
        this.print = function () { return _this.cards.map(function (card) { return card.print(); }).join(); };
        this.cards = [];
    }
    return CardDeck;
}());
exports["default"] = CardDeck;
