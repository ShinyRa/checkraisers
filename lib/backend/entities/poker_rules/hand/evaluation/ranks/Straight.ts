import PlayingCard from '../../../deck/card/PlayingCard';
import { type IRankable } from '../../IRankable';
import { PlayerHand } from '../../PlayerHand';
import { HandRank } from '../HandRank';
import { HandScore } from '../HandScore';

export class Straight extends HandRank implements IRankable<Straight, HandScore> {
	straightCards: PlayingCard[];
	isRoyal: boolean;
	isFlush: boolean;

	/**
	 * Create new Straight score
	 *
	 * @param hand PlayerHand
	 * @param straightCards PlayingCard[]
	 * @param isFlush boolean
	 * @param isRoyal boolean
	 */
	constructor(hand: PlayerHand, straightCards: PlayingCard[], isFlush = false, isRoyal = false) {
		super(hand.cards.filter((card) => ![...straightCards].includes(card)));
		this.straightCards = this.sort(straightCards);
		this.isFlush = isFlush;
		this.isRoyal = isRoyal;

		this.score = HandScore.STRAIGHT;

		if (isFlush) {
			this.score = HandScore.STRAIGHT_FLUSH;
		}
		if (isRoyal) {
			this.score = HandScore.ROYAL_FLUSH;
		}
	}

	/**
	 * Beats other rank
	 *
	 * @param opponent HandRank
	 *
	 * @returns number
	 */
	beats = (opponent: HandRank): number => {
		if (opponent instanceof Straight && !super.beats(opponent)) {
			if (this.solve(opponent) === 0) {
				return this.beatsKickers(opponent);
			} else {
				return this.solve(opponent);
			}
		}
		return super.beats(opponent);
	};

	/**
	 * Solve comparison between two straight ranks
	 *
	 * @param opponent Straight
	 *
	 * @returns number
	 */
	private solve(opponent: Straight): number {
		return this.getHighCard().compareTo(opponent.getHighCard());
	}

	/**
	 * Print straight as string
	 *
	 * @returns string
	 */
	print = (): string => {
		return `${this.isRoyal ? 'Royal ' : ''}Straight${
			this.isFlush ? ' Flush' : ''
		}: ${this.straightCards.map((card) => card.print()).join(' and ')}`.trim();
	};

	/**
	 * Get straight's highest card
	 *
	 * @returns PlayingCard
	 */
	getHighCard = (): PlayingCard => {
		return this.straightCards[this.straightCards.length - 1];
	};

	/**
	 * Get straight cards
	 *
	 * @returns PlayingCard[]
	 */
	getCards = (): PlayingCard[] => this.straightCards;
}
