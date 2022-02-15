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

	constructor(suit: CardSuit, value: CardValue, state: CardState = CardState.HIDDEN) {
		this.value = value;
		this.suit = suit;
		this.state = state ? state : CardState.REVEALED;
	}

	flip = (): PlayingCard => {
		this.state === CardState.REVEALED
			? (this.state = CardState.HIDDEN)
			: (this.state = CardState.REVEALED);

		return this;
	};

	reveal = (): void => {
		this.state = CardState.REVEALED;
	};

	isRevealed = (): boolean => this.state === CardState.REVEALED;

	assetName = (): string =>
		`${CardValue[this.value].toLowerCase()}_of_${CardSuit[this.suit].toLowerCase()}.png`;

	print = (): string =>
		CardValue[this.value].toLowerCase() + ' of ' + CardSuit[this.suit].toLowerCase();
}

export default PlayingCard;
