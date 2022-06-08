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
exports.__esModule = true;
exports.High = void 0;
var HandRank_1 = require("../HandRank");
var HandScore_1 = require("../HandScore");
var High = /** @class */ (function (_super) {
    __extends(High, _super);
    /**
     * Create new High card score
     *
     * @param hand PlayerHand
     * @param high PlayingCard
     */
    function High(hand, high) {
        var _this = _super.call(this, hand.cards) || this;
        /**
         * Beats other rank
         *
         * @param opponent HandRank
         *
         * @returns number
         */
        _this.beats = function (opponent) {
            if (opponent instanceof High) {
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
         * Print high as string
         *
         * @returns string
         */
        _this.print = function () {
            return "High card: " + _this.highCard.print();
        };
        /**
         * Get high card
         *
         * @returns PlayingCard[]
         */
        _this.getCards = function () { return [_this.highCard]; };
        _this.highCard = high;
        _this.score = HandScore_1.HandScore.HIGH;
        return _this;
    }
    /**
     * Solve comparison between two high ranks
     *
     * @param opponent High
     * @returns number
     */
    High.prototype.solve = function (opponent) {
        return this.highCard.compareTo(opponent.highCard);
    };
    return High;
}(HandRank_1.HandRank));
exports.High = High;
