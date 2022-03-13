import PlayingCard from '../../../deck/card/PlayingCard';
import { type IRankable } from '../../IRankable';
import { PlayerHand } from '../../PlayerHand';
import { HandRank } from '../HandRank';
import { HandScore } from '../HandScore';

export class TwoPair extends HandRank implements IRankable<TwoPair, HandScore> {
	topPair: PlayingCard[] = [];
	lowPair: PlayingCard[] = [];

	/**
	 * Create new TwoPair score
	 *
	 * @param hand PlayerHand
	 * @param topPair PlayingCard[]
	 * @param lowPair PlayingCard[]
	 */
	constructor(hand: PlayerHand, topPair: PlayingCard[], lowPair: PlayingCard[]) {
		super(hand.cards.filter((card) => ![...topPair, ...lowPair].includes(card)));
		this.score = HandScore.TWO_PAIR;
		this.topPair = topPair;
		this.lowPair = lowPair;
	}

	/**
	 * Beats other rank
	 *
	 * @param opponent HandRank
	 *
	 * @returns number
	 */
	beats = (opponent: HandRank): number => {
		if (opponent instanceof TwoPair) {
			if (this.solve(opponent) === 0) {
				return this.beatsKickers(opponent);
			} else {
				return this.solve(opponent);
			}
		}

		return super.beats(opponent);
	};

	/**
	 * Solve comparison between two two pair ranks
	 *
	 * @param opponent Pair
	 * @returns number
	 */
	private solve(opponent: TwoPair): number {
		return this.topPair[0].compareTo(opponent.topPair[0]);
	}

	/**
	 * Print twopair as string
	 *
	 * @returns string
	 */
	print = (): string => {
		return `Two Pair: Top: ${this.topPair
			.map((card) => card.print())
			.join(' and ')}, Low: ${this.lowPair.map((card) => card.print()).join(' and ')}
        `.trim();
	};

	/**
	 * Get two pair cards
	 *
	 * @returns PlayingCard[]
	 */
	getCards = (): PlayingCard[] => [...this.topPair, ...this.lowPair];
}
