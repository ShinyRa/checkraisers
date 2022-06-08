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
exports.TwoPair = void 0;
var HandRank_1 = require("../HandRank");
var HandScore_1 = require("../HandScore");
var TwoPair = /** @class */ (function (_super) {
    __extends(TwoPair, _super);
    /**
     * Create new TwoPair score
     *
     * @param hand PlayerHand
     * @param topPair PlayingCard[]
     * @param lowPair PlayingCard[]
     */
    function TwoPair(hand, topPair, lowPair) {
        var _this = _super.call(this, hand.cards.filter(function (card) { return !__spreadArrays(topPair, lowPair).includes(card); })) || this;
        _this.topPair = [];
        _this.lowPair = [];
        /**
         * Beats other rank
         *
         * @param opponent HandRank
         *
         * @returns number
         */
        _this.beats = function (opponent) {
            if (opponent instanceof TwoPair) {
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
         * Print twopair as string
         *
         * @returns string
         */
        _this.print = function () {
            return ("Two Pair: Top: " + _this.topPair
                .map(function (card) { return card.print(); })
                .join(' and ') + ", Low: " + _this.lowPair.map(function (card) { return card.print(); }).join(' and ') + "\n        ").trim();
        };
        /**
         * Get two pair cards
         *
         * @returns PlayingCard[]
         */
        _this.getCards = function () { return __spreadArrays(_this.topPair, _this.lowPair); };
        _this.score = HandScore_1.HandScore.TWO_PAIR;
        _this.topPair = topPair;
        _this.lowPair = lowPair;
        return _this;
    }
    /**
     * Solve comparison between two two pair ranks
     *
     * @param opponent Pair
     * @returns number
     */
    TwoPair.prototype.solve = function (opponent) {
        if (this.topPair[0].compareTo(opponent.topPair[0]) === 0) {
            return this.lowPair[0].compareTo(opponent.lowPair[0]);
        }
        return this.topPair[0].compareTo(opponent.topPair[0]);
    };
    return TwoPair;
}(HandRank_1.HandRank));
exports.TwoPair = TwoPair;
