"use strict";
exports.__esModule = true;
exports.HandScore = void 0;
var HandScore;
(function (HandScore) {
    HandScore[HandScore["ROYAL_FLUSH"] = 9] = "ROYAL_FLUSH";
    HandScore[HandScore["STRAIGHT_FLUSH"] = 8] = "STRAIGHT_FLUSH";
    HandScore[HandScore["FOUR_OF_A_KIND"] = 7] = "FOUR_OF_A_KIND";
    HandScore[HandScore["FULL_HOUSE"] = 6] = "FULL_HOUSE";
    HandScore[HandScore["FLUSH"] = 5] = "FLUSH";
    HandScore[HandScore["STRAIGHT"] = 4] = "STRAIGHT";
    HandScore[HandScore["THREE_OF_A_KIND"] = 3] = "THREE_OF_A_KIND";
    HandScore[HandScore["TWO_PAIR"] = 2] = "TWO_PAIR";
    HandScore[HandScore["PAIR"] = 1] = "PAIR";
    HandScore[HandScore["HIGH"] = 0] = "HIGH";
})(HandScore = exports.HandScore || (exports.HandScore = {}));
