import { CardState } from './state/CardState';
import { CardSuit } from './identity/CardSuit';
import { CardValue } from './identity/CardValue';
import { CardIdentity } from './identity/CardIdentity';

export type Card = {
	state: CardState;
};

class PlayingCard implements Card {
	identity: CardIdentity;
	state: CardState;
	known: boolean;

	/**
	 * Create a new playingcard
	 *
	 * @param template template to make a card
	 * @param state CardState enum, default hidden
	 */
	constructor(identity: CardIdentity | string, state: CardState = CardState.HIDDEN) {
		this.identity =
			identity instanceof CardIdentity ? identity : CardIdentity.fromTemplate(identity);
		this.state = state ? state : CardState.REVEALED;
		this.known = this.state === CardState.REVEALED;
	}

	/**
	 * Flip card from hidden to revealed state or vice versa.
	 *
	 * @returns self
	 */
	flip = (): PlayingCard => {
		if (this.state === CardState.HIDDEN) {
			this.state = CardState.REVEALED;
			this.setAsKnown();
		} else if (this.state === CardState.REVEALED) {
			this.state = CardState.HIDDEN;
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
			? `${this.getValueReadable().toLowerCase()}_of_${this.getSuitReadable().toLowerCase()}.png`
			: `Cardback.png`;

	/**
	 * Print card details to string.
	 *
	 * template
	 * 	 *value* of *suit*
	 * example
	 * 	 two of hearts
	 *
	 * @returns string
	 */
	print = (): string => this.identity.print();

	/**
	 * Get readable value of card
	 *
	 * @returns string
	 */
	getValueReadable = (): string => this.identity.getValueReadable();

	/**
	 * Get actual value of card
	 *
	 * @returns CardValue
	 */
	getValue = (): CardValue => this.identity.getValue();

	/**
	 * Get readable suit of card
	 *
	 * @returns string
	 */
	getSuitReadable = (): string => this.identity.getSuitReadable();

	/**
	 * Get actual suit of card
	 *
	 * @returns CardSuit
	 */
	getSuit = (): CardSuit => this.identity.getSuit();

	/**
	 * Compare card value to other card value
	 *
	 * @param playingcard PlayingCard
	 *
	 * @returns number
	 */
	compareTo = (playingcard: PlayingCard): number => {
		return this.getValue() === playingcard.getValue()
			? 0
			: this.getValue() - playingcard.getValue();
	};
}

export default PlayingCard;
