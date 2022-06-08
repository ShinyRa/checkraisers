import CardDeck from '../../../backend/entities/poker_rules/deck/CardDeck';

export const deckAPI = {
	shuffleDeck(): Record<string, CardDeck> {
		const deck = new CardDeck();
		deck.populate().shuffle();

		return {
			deck
		};
	}
};
