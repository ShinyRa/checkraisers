import { CardIdentity } from './card/identity/CardIdentity';
import { CardSuit } from './card/identity/CardSuit';
import { CardValue } from './card/identity/CardValue';
import PlayingCard from './card/PlayingCard';

export type Deck = {
	cards: PlayingCard[];
};

class CardDeck implements Deck {
	cards: PlayingCard[];

	/**
	 * Create new card deck.
	 */
	constructor() {
		this.cards = [];
	}

	/**
	 * Populate deck with 52 playingcards.
	 *
	 * @returns self
	 */
	populate = (): CardDeck => {
		const suits = Object.values(CardSuit).filter((suit) => isNaN(Number(suit)));
		const values = Object.values(CardValue).filter((value) => isNaN(Number(value)));

		suits.forEach((suit) => {
			values.forEach((value) =>
				this.cards.push(new PlayingCard(new CardIdentity(CardSuit[suit], CardValue[value])))
			);
		});

		return this;
	};

	/**
	 * Shuffle deck.
	 *
	 * @returns self
	 */
	shuffle = (): CardDeck => {
		// Sort array semi-randomly
		[1, 2, 3, 4, 5].forEach(() => {
			this.cards.sort(() => 0.5 - Math.random());
		});

		return this;
	};

	/**
	 * Draw card from deck.
	 *
	 * @returns PlayingCard | undefined
	 */
	draw = (): PlayingCard | undefined => this.cards.pop();

	/**
	 * Peek next card in deck.
	 *
	 * @returns PlayingCard | undefined
	 */
	peek = (): PlayingCard | undefined => this.cards[this.cards.length - 1];

	/**
	 * If deck is empty.
	 *
	 * @returns boolean
	 */
	isEmpty = (): boolean => this.cards.length == 0;

	/**
	 * Print deck to string.
	 *
	 * @returns string
	 */
	print = (): string => this.cards.map((card) => card.print()).join();
}

export default CardDeck;
