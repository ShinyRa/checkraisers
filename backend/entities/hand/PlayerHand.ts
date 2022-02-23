import PlayingCard from '../deck/card/PlayingCard';

export type Hand = {
	cards: PlayingCard[];
};

class PlayerHand implements Hand {
	cards: PlayingCard[];

	/**
	 * Constructor.
	 *
	 * @param cards PlayingCard[]
	 */
	constructor(cards: PlayingCard[] = []) {
		this.cards = cards;
	}

	/**
	 * Deal a card to player hand
	 *
	 * @param card PlayingCard
	 */
	deal = (card: PlayingCard): void => {
		this.cards.push(card);
	};

	/**
	 * Reveal all cards from a hand
	 */
	reveal = (): void => {
		this.cards.forEach((card) => card.reveal());
	};

	print = (): string => this.cards.map((card) => card.print()).join(' and ');
}

export default PlayerHand;
