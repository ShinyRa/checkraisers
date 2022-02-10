import { CardValue } from '../../../client/card/CardValue';
import { CardSuit } from '../../../client/card/CardSuit';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post(): Promise<Record<string, any>> {
	const suits = Object.values(CardSuit).filter((suit) => isNaN(Number(suit)));
	const values = Object.values(CardValue).filter((value) => isNaN(Number(value)));
	const merged = [];

	suits.forEach((suit) => {
		values.forEach((value) => merged.push(`${value}_OF_${suit}`));
	});

	merged.sort(() => 0.5 - Math.random());

	return {
		body: {
			data: merged
		}
	};
}
