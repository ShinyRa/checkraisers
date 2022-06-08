"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.Flush = void 0;
var HandRank_1 = require("../HandRank");
var HandScore_1 = require("../HandScore");
var Flush = /** @class */ (function (_super) {
    __extends(Flush, _super);
    /**
     * Create new Flush score
     *
     * @param hand PlayerHand
     * @param flushCards PlayingCard[]
     */
    function Flush(hand, flushCards) {
        var _this = _super.call(this, hand.cards.filter(function (card) { return !__spreadArrays(flushCards).includes(card); })) || this;
        /**
         * Beats other rank
         *
         * @param opponent HandRank
         *
         * @returns number
         */
        _this.beats = function (opponent) {
            if (opponent instanceof Flush) {
                if (_this.solve(opponent) === 0) {
                    return _this.beatsKickers(opponent);
                }
                else {
                    return _this.solve(opponent);
                }
            }
            return _super.prototype.beats.call(_this, opponent);
        };
        /**
         * Print flush as string
         *
         * @returns string
         */
        _this.print = function () {
            return ("Flush: " + _this.flushCards.map(function (card) { return card.print(); }).join(' and ')).trim();
        };
        /**
         * Get flush's highest card
         *
         * @returns PlayingCard
         */
        _this.getHighCard = function () {
            return _this.flushCards[_this.flushCards.length - 1];
        };
        /**
         * Get flush cards
         *
         * @returns PlayingCard[]
         */
        _this.getCards = function () { return _this.flushCards; };
        _this.score = HandScore_1.HandScore.FLUSH;
        _this.flushCards = _this.sort(flushCards);
        return _this;
    }
    /**
     * Solve comparison between two flush ranks
     *
     * @param opponent Flush
     *
     * @returns number
     */
    Flush.prototype.solve = function (opponent) {
        return this.getHighCard().compareTo(opponent.getHighCard());
    };
    return Flush;
}(HandRank_1.HandRank));
exports.Flush = Flush;
