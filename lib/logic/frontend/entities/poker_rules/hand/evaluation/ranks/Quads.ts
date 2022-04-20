import PlayingCard from '../../../deck/card/PlayingCard';
import { type IRankable } from '../../IRankable';
import { PlayerHand } from '../../PlayerHand';
import { HandRank } from '../HandRank';
import { HandScore } from '../HandScore';

export class Quads extends HandRank implements IRankable<Quads, HandScore> {
	quadsCards: PlayingCard[] = [];

	/**
	 * Create new Quad
	 *
	 * @param hand PlayerHand
	 * @param quads PlayingCard[]
	 */
	constructor(hand: PlayerHand, quads: PlayingCard[]) {
		super(hand.cards.filter((card) => ![...quads].includes(card)));
		this.score = HandScore.FOUR_OF_A_KIND;
		this.quadsCards = quads;
	}

	/**
	 * Beats other rank
	 *
	 * @param opponent HandRank
	 *
	 * @returns number
	 */
	beats = (opponent: HandRank): number => {
		if (opponent instanceof Quads) {
			if (this.solve(opponent) === 0) {
				return this.beatsKickers(opponent);
			} else {
				return this.solve(opponent);
			}
		}

		return super.beats(opponent);
	};

	/**
	 * Solve comparison between two quad ranks
	 *
	 * @param opponent Quads
	 *
	 * @returns number
	 */
	private solve(opponent: Quads): number {
		return this.quadsCards[0].compareTo(opponent.quadsCards[0]);
	}

	/**
	 * Print quad as string
	 *
	 * @returns string
	 */
	print = (): string => {
		return `Four of a kind: ${this.quadsCards.map((card) => card.print()).join(' and ')}`.trim();
	};

	/**
	 * Get quad cards
	 *
	 * @returns PlayingCard[]
	 */
	getCards = (): PlayingCard[] => this.quadsCards;
}
