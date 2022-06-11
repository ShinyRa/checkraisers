"use strict";
exports.__esModule = true;
exports.PlayerHand = void 0;
var Evaluation_1 = require("./Evaluation");
var PlayerHand = /** @class */ (function () {
    /**
     * Constructor.
     *
     * @param cards PlayingCard[]
     */
    function PlayerHand(cards) {
        var _this = this;
        if (cards === void 0) { cards = []; }
        /**
         * Deal a set of cards to player hand
         *
         * @param cards PlayingCard[]
         */
        this.deal = function () {
            var cards = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                cards[_i] = arguments[_i];
            }
            cards.forEach(function (card) { return _this.cards.push(card); });
        };
        /**
         * Reveal all cards from a hand
         */
        this.reveal = function () {
            _this.cards.map(function (card) { return card.reveal(); });
        };
        /**
         * Estimate the rank of hand and board cards
         *
         * @param board PlayingCard[]
         */
        this.estimate = function (board) {
            var handEval = new Evaluation_1["default"]();
            _this.score = handEval.findScore(board, _this);
        };
        /**
         * If hand beats opponent hand
         *
         * @param hand PlayerHand
         *
         * @returns number
         */
        this.beats = function (hand) {
            if (_this.score.beats(hand.score) === 0) {
                return _this.score.beatsKickers(hand.score);
            }
            return _this.score.beats(hand.score);
        };
        /**
         * Print cards in hand as string
         *
         * @returns string
         */
        this.print = function () { return _this.cards.map(function (card) { return card.print(); }).join(' and '); };
        this.cards = cards;
    }
    return PlayerHand;
}());
exports.PlayerHand = PlayerHand;
