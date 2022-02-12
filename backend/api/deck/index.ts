import { CardValue } from '../../entities/deck/card/CardValue';
import { CardSuit } from '../../entities/deck/card/CardSuit';
import type { Card } from '../../entities/deck/card/Card';

export const deckAPI = {
	shuffleDeck(): Record<string, Array<Card>> {
		const suits = Object.values(CardSuit).filter((suit) => isNaN(Number(suit)));
		const values = Object.values(CardValue).filter((value) => isNaN(Number(value)));
		const shuffled = Array<Card>();

		suits.forEach((suit) => {
			values.forEach((value) => shuffled.push({ value: CardValue[value], suit: CardSuit[suit] }));
		});

		// Sort array semi-randomly
		[1, 2, 3, 4, 5].forEach(() => {
			shuffled.sort(() => 0.5 - Math.random());
		});

		return {
			deck: shuffled
		};
	}
};
