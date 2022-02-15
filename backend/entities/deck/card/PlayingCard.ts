import { CardState } from './CardState';
import { CardSuit } from './CardSuit';
import { CardValue } from './CardValue';

export type Card = {
	value: CardValue;
	suit: CardSuit;
	state: CardState;
};

class PlayingCard implements Card {
	value: CardValue;
	suit: CardSuit;
	state: CardState;

	/**
	 * Create a new playingcard
	 *
	 * @param suit CardSuit enum
	 * @param value CardValue enum
	 * @param state CardState enum, default hidden
	 */
	constructor(suit: CardSuit, value: CardValue, state: CardState = CardState.HIDDEN) {
		this.value = value;
		this.suit = suit;
		this.state = state ? state : CardState.REVEALED;
	}

	/**
	 * Flip card from hidden to revealed state or vice versa.
	 *
	 * @returns self
	 */
	flip = (): PlayingCard => {
		this.state === CardState.REVEALED
			? (this.state = CardState.HIDDEN)
			: (this.state = CardState.REVEALED);

		return this;
	};

	/**
	 * Set card state to revealed.
	 *
	 * @returns void
	 */
	reveal = (): void => {
		this.state = CardState.REVEALED;
	};

	/**
	 * If card is currently revealed.
	 *
	 * @returns boolean
	 */
	isRevealed = (): boolean => this.state === CardState.REVEALED;

	/**
	 * Get asset name of card.
	 *
	 * template
	 * 	 *value*_of_*suit*.png
	 * example
	 * 	 two_of_hearts.png
	 *
	 * @returns string
	 */
	assetName = (): string =>
		`${CardValue[this.value].toLowerCase()}_of_${CardSuit[this.suit].toLowerCase()}.png`;

	/**
	 * print card details to string.
	 *
	 * template
	 * 	 *value* of *suit*
	 * example
	 * 	 two of hearts
	 *
	 * @returns string
	 */
	print = (): string =>
		CardValue[this.value].toLowerCase() + ' of ' + CardSuit[this.suit].toLowerCase();
}

export default PlayingCard;
