import CardDeck from '../../../backend/entities/deck/CardDeck';

let deck: CardDeck;

beforeAll(() => {
	deck = new CardDeck();
	deck.populate();
});

describe('Card deck unit testing', () => {
	it('should be populated with 52 cards', () => {
		expect(deck.cards.length).toEqual(52);
	});

	it('should be shuffled', () => {
		const shuffledDeck = new CardDeck().populate().shuffle();
		expect(shuffledDeck.print()).not.toBe(deck.print());
	});

	it('should draw the next card', () => {
		const cardToDraw = deck.peek();
		const draw = deck.draw();
		expect(draw.print()).toEqual(cardToDraw.print());
		expect(deck.cards.length).toEqual(51);
	});
});
