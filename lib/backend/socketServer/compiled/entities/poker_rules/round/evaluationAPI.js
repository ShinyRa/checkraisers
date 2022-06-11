"use strict";
exports.__esModule = true;
exports.evaluationAPI = void 0;
exports.evaluationAPI = {
    evaluate: function (players, table) {
        var hands = players.map(function (player) { return player.hand; });
        hands.map(function (hand) { return hand.estimate(table); });
        hands.sort(function (hand1, hand2) { return hand1.beats(hand2); });
        return {
            winner: players.filter(function (player) { return player.hand === hands[hands.length - 1]; })[0],
            // TODO: What if match is a draw?
            winningHand: hands[hands.length - 1]
        };
    }
};
