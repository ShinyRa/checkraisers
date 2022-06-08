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
exports.Straight = void 0;
var HandRank_1 = require("../HandRank");
var HandScore_1 = require("../HandScore");
var Straight = /** @class */ (function (_super) {
    __extends(Straight, _super);
    /**
     * Create new Straight score
     *
     * @param hand PlayerHand
     * @param straightCards PlayingCard[]
     * @param isFlush boolean
     * @param isRoyal boolean
     */
    function Straight(hand, straightCards, isFlush, isRoyal) {
        if (isFlush === void 0) { isFlush = false; }
        if (isRoyal === void 0) { isRoyal = false; }
        var _this = _super.call(this, hand.cards.filter(function (card) { return !__spreadArrays(straightCards).includes(card); })) || this;
        /**
         * Beats other rank
         *
         * @param opponent HandRank
         *
         * @returns number
         */
        _this.beats = function (opponent) {
            if (opponent instanceof Straight && !_super.prototype.beats.call(_this, opponent)) {
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
         * Print straight as string
         *
         * @returns string
         */
        _this.print = function () {
            return ((_this.isRoyal ? 'Royal ' : '') + "Straight" + (_this.isFlush ? ' Flush' : '') + ": " + _this.straightCards.map(function (card) { return card.print(); }).join(' and ')).trim();
        };
        /**
         * Get straight's highest card
         *
         * @returns PlayingCard
         */
        _this.getHighCard = function () {
            return _this.straightCards[_this.straightCards.length - 1];
        };
        /**
         * Get straight cards
         *
         * @returns PlayingCard[]
         */
        _this.getCards = function () { return _this.straightCards; };
        _this.straightCards = _this.sort(straightCards);
        _this.isFlush = isFlush;
        _this.isRoyal = isRoyal;
        _this.score = HandScore_1.HandScore.STRAIGHT;
        if (isFlush) {
            _this.score = HandScore_1.HandScore.STRAIGHT_FLUSH;
        }
        if (isRoyal) {
            _this.score = HandScore_1.HandScore.ROYAL_FLUSH;
        }
        return _this;
    }
    /**
     * Solve comparison between two straight ranks
     *
     * @param opponent Straight
     *
     * @returns number
     */
    Straight.prototype.solve = function (opponent) {
        return this.getHighCard().compareTo(opponent.getHighCard());
    };
    return Straight;
}(HandRank_1.HandRank));
exports.Straight = Straight;
