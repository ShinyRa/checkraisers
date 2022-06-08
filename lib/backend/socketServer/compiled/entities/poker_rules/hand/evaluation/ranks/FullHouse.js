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
exports.FullHouse = void 0;
var HandRank_1 = require("../HandRank");
var HandScore_1 = require("../HandScore");
var FullHouse = /** @class */ (function (_super) {
    __extends(FullHouse, _super);
    /**
     * Create new FullHouse score
     *
     * @param hand PlayerHand
     * @param trips PlayingCard[]
     * @param pair PlayingCard[]
     */
    function FullHouse(hand, trips, pair) {
        var _this = _super.call(this, hand.cards.filter(function (card) { return !__spreadArrays(trips, pair).includes(card); })) || this;
        /**
         * Beats other rank
         *
         * @param opponent HandRank
         *
         * @returns number
         */
        _this.beats = function (opponent) {
            if (opponent instanceof FullHouse) {
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
         * Print fullhouse as string
         *
         * @returns string
         */
        _this.print = function () {
            return ("Full house: Trips: " + _this.tripsCards
                .map(function (card) { return card.print(); })
                .join(' and ') + ", Pair: " + _this.pairCards.map(function (card) { return card.print(); }).join(' and ') + "\n        ").trim();
        };
        /**
         * Get fullhouse cards
         *
         * @returns PlayingCard[]
         */
        _this.getCards = function () { return __spreadArrays(_this.tripsCards, _this.pairCards); };
        _this.score = HandScore_1.HandScore.FULL_HOUSE;
        _this.tripsCards = trips;
        _this.pairCards = pair;
        return _this;
    }
    /**
     * Solve comparison between two fullhouse ranks
     *
     * @param opponent FullHouse
     *
     * @returns number
     */
    FullHouse.prototype.solve = function (opponent) {
        if (this.tripsCards[0].compareTo(opponent.tripsCards[0]) === 0) {
            return this.pairCards[0].compareTo(opponent.pairCards[0]);
        }
        return this.tripsCards[0].compareTo(opponent.tripsCards[0]);
    };
    return FullHouse;
}(HandRank_1.HandRank));
exports.FullHouse = FullHouse;
