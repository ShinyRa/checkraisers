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
exports.Trips = void 0;
var HandRank_1 = require("../HandRank");
var HandScore_1 = require("../HandScore");
var Trips = /** @class */ (function (_super) {
    __extends(Trips, _super);
    /**
     * Create new Trip score
     *
     * @param hand PlayerHand
     * @param trips PlayingCard[]
     */
    function Trips(hand, trips) {
        var _this = _super.call(this, hand.cards.filter(function (card) { return !__spreadArrays(trips).includes(card); })) || this;
        _this.tripsCards = [];
        /**
         * Beats other rank
         *
         * @param opponent HandRank
         *
         * @returns number
         */
        _this.beats = function (opponent) {
            if (opponent instanceof Trips) {
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
         * Print trips as string
         *
         * @returns string
         */
        _this.print = function () {
            return ("Three of a kind: " + _this.tripsCards.map(function (card) { return card.print(); }).join(' and ')).trim();
        };
        /**
         * Get trips cards
         *
         * @returns PlayingCard[]
         */
        _this.getCards = function () { return _this.tripsCards; };
        _this.score = HandScore_1.HandScore.THREE_OF_A_KIND;
        _this.tripsCards = trips;
        return _this;
    }
    /**
     * Solve comparison between two three of a kind ranks
     *
     * @param opponent Trips
     *
     * @returns number
     */
    Trips.prototype.solve = function (opponent) {
        return this.tripsCards[0].compareTo(opponent.tripsCards[0]);
    };
    return Trips;
}(HandRank_1.HandRank));
exports.Trips = Trips;
