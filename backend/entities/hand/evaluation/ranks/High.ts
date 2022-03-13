import PlayingCard from '../../../deck/card/PlayingCard';
import { type IRankable } from '../../IRankable';
import { PlayerHand } from '../../PlayerHand';
import { HandRank } from '../HandRank';
import { HandScore } from '../HandScore';

export class High extends HandRank implements IRankable<High, HandScore> {
	highCard: PlayingCard;

	/**
	 * Create new High card score
	 *
	 * @param hand PlayerHand
	 * @param high PlayingCard
	 */
	constructor(hand: PlayerHand, high: PlayingCard) {
		super(hand.cards);
		this.highCard = high;
		this.score = HandScore.HIGH;
	}

	/**
	 * Beats other rank
	 *
	 * @param opponent HandRank
	 *
	 * @returns number
	 */
	beats = (opponent: HandRank): number => {
		if (opponent instanceof High) {
			if (this.solve(opponent) === 0) {
				return this.beatsKickers(opponent);
			} else {
				return this.solve(opponent);
			}
		}

		return super.beats(opponent);
	};

	/**
	 * Solve comparison between two high ranks
	 *
	 * @param opponent High
	 * @returns number
	 */
	private solve(opponent: High): number {
		return this.highCard.compareTo(opponent.highCard);
	}

	/**
	 * Print high as string
	 *
	 * @returns string
	 */
	print = (): string => {
		return `High card: ${this.highCard.print()}`;
	};

	/**
	 * Get high card
	 *
	 * @returns PlayingCard[]
	 */
	getCards = (): PlayingCard[] => [this.highCard];
}
