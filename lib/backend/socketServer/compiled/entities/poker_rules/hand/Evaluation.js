"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var ranks_1 = require("./evaluation/ranks");
var CardSuit_1 = require("../deck/card/identity/CardSuit");
var CardValue_1 = require("../deck/card/identity/CardValue");
var HandEvaluation = /** @class */ (function () {
    function HandEvaluation() {
        var _this = this;
        this.findScore = function (tableCards, hand) {
            var allCards = __spreadArrays(hand.cards, tableCards);
            allCards.sort(function (card1, card2) { return card1.compareTo(card2); });
            var valueScoring = _this.createScoringArray(CardValue_1.CardValue);
            allCards.forEach(function (card) { return (valueScoring[card.getValue() - 2] = __spreadArrays(valueScoring[card.getValue() - 2], [card])); });
            var suitScoring = _this.createScoringArray(CardSuit_1.CardSuit);
            allCards.forEach(function (card) { return (suitScoring[card.getSuit() - 1] = __spreadArrays(suitScoring[card.getSuit() - 1], [card])); });
            var pairs = 0;
            var trips = 0;
            var quads = 0;
            valueScoring.forEach(function (value) {
                if (value.length === 2) {
                    pairs++;
                }
                if (value.length === 3) {
                    trips++;
                }
                if (value.length === 4) {
                    quads++;
                }
            });
            if (_this.hasStraight(valueScoring)) {
                var straights = _this.findStraight(valueScoring);
                var converted = straights.map(function (straight) {
                    return new ranks_1.Straight(hand, straight, _this.straightIsFlush(straight), _this.straightIsRoyal(straight));
                });
                converted.sort(function (straight1, straight2) { return straight1.beats(straight2); });
                return converted[converted.length - 1];
            }
            if (_this.isFlush(suitScoring)) {
                return new ranks_1.Flush(hand, _this.findFlush(suitScoring));
            }
            if (quads === 1) {
                return new ranks_1.Quads(hand, _this.findQuads(valueScoring));
            }
            if (trips >= 1 && pairs >= 1) {
                // TODO: Sort highest with 3 or more
                var _a = _this.findFullHouse(valueScoring), triple = _a[0], double = _a[1];
                return new ranks_1.FullHouse(hand, triple, double);
            }
            if (trips >= 1) {
                return new ranks_1.Trips(hand, _this.findTrips(valueScoring));
            }
            if (pairs >= 2) {
                var twoPairs = _this.findTwoPair(valueScoring);
                var lowPair = twoPairs[twoPairs.length - 2];
                var highPair = twoPairs[twoPairs.length - 1];
                return new ranks_1.TwoPair(hand, highPair, lowPair);
            }
            if (pairs === 1) {
                return new ranks_1.Pair(hand, _this.findPair(valueScoring));
            }
            var flat = valueScoring.flat();
            return new ranks_1.High(hand, flat[flat.length - 1]);
        };
        this.findPair = function (valueScoring) {
            return valueScoring.filter(function (value) { return value.length === 2; }).flat();
        };
        this.findTwoPair = function (valueScoring) {
            return valueScoring.filter(function (value) { return value.length === 2; });
        };
        this.findTrips = function (valueScoring) {
            return valueScoring.filter(function (value) { return value.length === 3; }).flat();
        };
        this.findFlush = function (suitScoring) {
            return suitScoring.filter(function (suit) { return suit.length >= 5; }).flat();
        };
        this.isFlush = function (suitScoring) { return suitScoring.find(function (suit) { return suit.length >= 5; }) != null; };
        this.hasStraight = function (valueScoring) { return _this.findStraight(valueScoring).length > 0; };
        this.straightIsFlush = function (valueScoring) {
            return valueScoring.filter(function (card) { return card.getSuit() == valueScoring[0].getSuit(); }).length === 5;
        };
        this.straightIsRoyal = function (valueScoring) {
            return valueScoring.reduce(function (acc, card) { return acc + card.getValue(); }, 0) === 60;
        };
        this.findStraight = function (valueScoring) {
            var straights = [];
            // Insert aces in front of the array (It can make a straight with A-2-3-4-5 or 10-J-Q-K-A)
            valueScoring = __spreadArrays([valueScoring[valueScoring.length - 1]], valueScoring);
            var reversed = valueScoring.reverse();
            reversed.forEach(function (_, index) {
                var from = index;
                var to = index + 5;
                if (to <= reversed.length) {
                    var straightSlice = reversed.slice(from, to);
                    if (straightSlice.every(function (value) { return value.length > 0; }) && straightSlice.length === 5) {
                        straights.push(straightSlice.flat());
                    }
                }
            });
            return straights;
        };
        this.findFullHouse = function (valueScoring) { return [
            valueScoring.filter(function (value) { return value.length === 3; }).flat(),
            valueScoring.filter(function (value) { return value.length === 2; }).flat()
        ]; };
        this.findQuads = function (valueScoring) {
            return valueScoring.filter(function (value) { return value.length === 4; }).flat();
        };
        this.createScoringArray = function (enumObject) {
            return new Array(Object.keys(enumObject).filter(function (key) { return !isNaN(Number(enumObject[key])); }).length).fill([]);
        };
    }
    return HandEvaluation;
}());
exports["default"] = HandEvaluation;
