import { CardSuit } from './CardSuit';
import { CardValue } from './CardValue';

export type Card = {
	value: CardValue;
	suit: CardSuit;
};
