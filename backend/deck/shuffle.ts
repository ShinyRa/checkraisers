import { CardValue } from './CardValue';
import { CardSuit } from './CardSuit';

export const deckAPI = {
	shuffledDeck(): Record<string, Array<string>> {
		const suits = Object.values(CardSuit).filter((suit) => isNaN(Number(suit)));
		const values = Object.values(CardValue).filter((value) => isNaN(Number(value)));
		const merged = [];

		suits.forEach((suit) => {
			values.forEach((value) => merged.push(`${value}_OF_${suit}`));
		});

		merged.sort(() => 0.5 - Math.random());

		return {
			data: merged
		};
	}
};
