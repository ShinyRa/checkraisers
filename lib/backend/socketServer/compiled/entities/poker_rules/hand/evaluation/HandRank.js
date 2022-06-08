"use strict";
exports.__esModule = true;
exports.HandRank = void 0;
var HandRank = /** @class */ (function () {
    /**
     * Create a new Evaluation of hand and cards on the table
     *
     * @param kickers
     */
    function HandRank(kickers) {
        this.kickers = kickers;
    }
    /**
     * HandRank beats other rank by score
     *
     * @param rank
     * @returns
     */
    HandRank.prototype.beats = function (rank) {
        return this.score - rank.score;
    };
    /**
     * Sort batch of playing cards based on their value
     *
     * @param playingCards
     * @returns
     */
    HandRank.prototype.sort = function (playingCards) {
        return playingCards.sort(function (card1, card2) { return card1.compareTo(card2); });
    };
    /**
     * Does this rank win by kickers over other rank?
     *
     * @param opponent
     * @returns
     */
    HandRank.prototype.beatsKickers = function (opponent) {
        var playerKickers = this.sort(this.kickers).reverse();
        var opponentKickers = this.sort(opponent.kickers).reverse();
        // If our rank has no kickers, it loses to opponent rank
        if (playerKickers.length === 0) {
            return 0;
        }
        // If opponent has no kickers, it loses to our rank
        if (opponentKickers.length === 0) {
            return 1;
        }
        // If kickers are equal, look at our and opponent second kickers
        if (playerKickers[0].compareTo(opponentKickers[0]) === 0) {
            // If we and our opponent have second kickers
            if (playerKickers.length > 1 && opponentKickers.length > 1) {
                return playerKickers[1].compareTo(opponentKickers[1]);
            }
        }
        else {
            return playerKickers[0].compareTo(opponentKickers[0]);
        }
    };
    return HandRank;
}());
exports.HandRank = HandRank;
