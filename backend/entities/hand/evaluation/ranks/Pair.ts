import PlayingCard from '../../../deck/card/PlayingCard';
import { type IRankable } from '../../IRankable';
import { PlayerHand } from '../../PlayerHand';
import { HandRank } from '../HandRank';
import { HandScore } from '../HandScore';

export class Pair extends HandRank implements IRankable<Pair, HandScore> {
	pairCards: PlayingCard[] = [];

	/**
	 * Create new Pair score
	 *
	 * @param hand PlayerHand
	 * @param pairCards PlayingCard[]
	 */
	constructor(hand: PlayerHand, pairCards: PlayingCard[]) {
		super(hand.cards.filter((card) => ![...pairCards].includes(card)));
		this.score = HandScore.PAIR;
		this.pairCards = pairCards;
	}

	/**
	 * Beats other rank
	 *
	 * @param opponent HandRank
	 *
	 * @returns number
	 */
	beats = (opponent: HandRank): number => {
		if (opponent instanceof Pair) {
			if (this.solve(opponent) === 0) {
				return this.beatsKickers(opponent);
			} else {
				return this.solve(opponent);
			}
		}

		return super.beats(opponent);
	};

	/**
	 * Solve comparison between two pair ranks
	 *
	 * @param opponent Pair
	 *
	 * @returns number
	 */
	private solve(opponent: Pair): number {
		return this.pairCards[0].compareTo(opponent.pairCards[0]);
	}

	/**
	 * Print pair as string
	 *
	 * @returns string
	 */
	print = (): string => {
		return `Pair: ${this.pairCards.map((card) => card.print()).join(' and ')}`.trim();
	};

	/**
	 * Get pair cards
	 *
	 * @returns PlayingCard[]
	 */
	getCards = (): PlayingCard[] => this.pairCards;
}
