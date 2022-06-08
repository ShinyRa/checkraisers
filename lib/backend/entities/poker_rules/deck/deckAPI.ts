import CardDeck from './CardDeck';

export const deckAPI = {
	shuffleDeck(): Record<string, CardDeck> {
		const deck = new CardDeck();
		deck.populate().shuffle();

		return {
			deck
		};
	}
};
