"use strict";
exports.__esModule = true;
exports.deckAPI = void 0;
var CardDeck_1 = require("./CardDeck");
exports.deckAPI = {
    shuffleDeck: function () {
        var deck = new CardDeck_1["default"]();
        deck.populate().shuffle();
        return {
            deck: deck
        };
    }
};
