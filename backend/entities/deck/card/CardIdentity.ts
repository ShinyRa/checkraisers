import { CardSuit } from './CardSuit';
import { CardValue } from './CardValue';

type Identity = {
	value: CardValue;
	suit: CardSuit;
};

export class CardIdentity implements Identity {
	value: CardValue;
	suit: CardSuit;

	/**
	 * Create a new CardIdentity
	 */
	constructor(suit: CardSuit, value: CardValue) {
		this.value = value;
		this.suit = suit;
	}

	static formTemplate = (template: string): CardIdentity | null => {
		if (template.length > 3 || template.length < 1) {
			return null;
		}

		const [templateSuit, templateValue] = [template.slice(0, 1), template.slice(1)];
		let suit;
		let value;

		switch (templateSuit) {
			case '♠':
				suit = CardSuit.SPADES;
				break;

			case '♣':
				suit = CardSuit.CLUBS;
				break;

			case '♥':
				suit = CardSuit.HEARTS;
				break;

			case '♦':
				suit = CardSuit.DIAMONDS;
				break;
		}

		if (isNaN(Number(templateValue))) {
			switch (templateValue) {
				case 'J':
					value = CardValue.JACK;
					break;

				case 'Q':
					value = CardValue.QUEEN;
					break;

				case 'K':
					value = CardValue.KING;
					break;

				case 'A':
					value = CardValue.ACE;
					break;
			}
		} else {
			value = Number(templateValue);
		}

		return new CardIdentity(suit, value);
	};

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
	getValue = (): CardValue => this.value;

	getValueReadable = (): string => CardValue[this.value];

	getSuit = (): CardSuit => this.suit;

	getSuitReadable = (): string => CardSuit[this.suit];
}
