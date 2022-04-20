import PlayingCard from '../../../deck/card/PlayingCard';
import { type IRankable } from '../../IRankable';
import { PlayerHand } from '../../PlayerHand';
import { HandRank } from '../HandRank';
import { HandScore } from '../HandScore';

export class Flush extends HandRank implements IRankable<Flush, HandScore> {
	flushCards: PlayingCard[];

	/**
	 * Create new Flush score
	 *
	 * @param hand PlayerHand
	 * @param flushCards PlayingCard[]
	 */
	constructor(hand: PlayerHand, flushCards: PlayingCard[]) {
		super(hand.cards.filter((card) => ![...flushCards].includes(card)));
		this.score = HandScore.FLUSH;
		this.flushCards = this.sort(flushCards);
	}

	/**
	 * Beats other rank
	 *
	 * @param opponent HandRank
	 *
	 * @returns number
	 */
	beats = (opponent: HandRank): number => {
		if (opponent instanceof Flush) {
			if (this.solve(opponent) === 0) {
				return this.beatsKickers(opponent);
			} else {
				return this.solve(opponent);
			}
		}

		return super.beats(opponent);
	};

	/**
	 * Solve comparison between two flush ranks
	 *
	 * @param opponent Flush
	 *
	 * @returns number
	 */
	private solve(opponent: Flush): number {
		return this.getHighCard().compareTo(opponent.getHighCard());
	}

	/**
	 * Print flush as string
	 *
	 * @returns string
	 */
	print = (): string => {
		return `Flush: ${this.flushCards.map((card) => card.print()).join(' and ')}`.trim();
	};

	/**
	 * Get flush's highest card
	 *
	 * @returns PlayingCard
	 */
	getHighCard = (): PlayingCard => {
		return this.flushCards[this.flushCards.length - 1];
	};

	/**
	 * Get flush cards
	 *
	 * @returns PlayingCard[]
	 */
	getCards = (): PlayingCard[] => this.flushCards;
}
