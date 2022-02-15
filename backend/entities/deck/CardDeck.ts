import { CardSuit } from './card/CardSuit';
import { CardValue } from './card/CardValue';
import PlayingCard from './card/PlayingCard';

export type Deck = {
	cards: PlayingCard[];
};

class CardDeck implements Deck {
	cards: PlayingCard[];

	constructor() {
		this.cards = [];
	}

	populate = (): CardDeck => {
		const suits = Object.values(CardSuit).filter((suit) => isNaN(Number(suit)));
		const values = Object.values(CardValue).filter((value) => isNaN(Number(value)));

		suits.forEach((suit) => {
			values.forEach((value) => this.cards.push(new PlayingCard(CardSuit[suit], CardValue[value])));
		});

		return this;
	};

	shuffle = (): CardDeck => {
		// Sort array semi-randomly
		[1, 2, 3, 4, 5].forEach(() => {
			this.cards.sort(() => 0.5 - Math.random());
		});

		return this;
	};

	draw = (): PlayingCard => {
		if (this.cards.length > 1) {
			return this.cards.pop();
		}
	};

	peek = (): PlayingCard => this.cards[this.cards.length - 1];

	isEmpty = (): boolean => this.cards.length == 0;

	print = (): string => this.cards.map((card) => card.print()).join();
}

export default CardDeck;
