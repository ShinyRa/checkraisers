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
	known: boolean;

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
		this.known = this.state === CardState.REVEALED ? true : false;
	}

	/**
	 * Flip card from hidden to revealed state or vice versa.
	 *
	 * @returns self
	 */
	flip = (): PlayingCard => {
		if (this.state === CardState.REVEALED) {
			this.state = CardState.HIDDEN;
		}

		if (this.state === CardState.HIDDEN) {
			this.state = CardState.REVEALED;
			this.setAsKnown();
		}

		return this;
	};

	/**
	 * Set card state to revealed.
	 *
	 * @returns void
	 */
	reveal = (): void => {
		this.state = CardState.REVEALED;
		this.setAsKnown();
	};

	/**
	 * If card is currently revealed.
	 *
	 * @returns boolean
	 */
	isRevealed = (): boolean => this.state === CardState.REVEALED;

	/**
	 * If card is known.
	 *
	 * @returns boolean
	 */
	isKnown = (): boolean => this.known;

	/**
	 * Set known
	 *
	 * @returns
	 */
	setAsKnown = (): void => {
		this.known = true;
	};

	/**
	 * Get asset name of card if it is known.
	 *
	 * template
	 * 	 *value*_of_*suit*.png
	 * example
	 * 	 two_of_hearts.png
	 *
	 * @returns string
	 */
	assetName = (): string =>
		this.isKnown()
			? `${CardValue[this.value].toLowerCase()}_of_${CardSuit[this.suit].toLowerCase()}.png`
			: `Cardback.png`;

	/**
	 * Pint card details to string.
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

	/**
	 * Get value of card
	 *
	 * @returns string
	 */
	getValue = (): string => CardValue[this.value];

	compareTo = (playingcard: PlayingCard): number => {
		if (this.value === playingcard.value) {
			return 0;
		} else {
			return this.value - playingcard.value;
		}
	};
}

export default PlayingCard;
