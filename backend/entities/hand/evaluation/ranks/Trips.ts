import PlayingCard from '../../../deck/card/PlayingCard';
import { type IRankable } from '../../IRankable';
import { PlayerHand } from '../../PlayerHand';
import { HandRank } from '../HandRank';
import { HandScore } from '../HandScore';

export class Trips extends HandRank implements IRankable<Trips, HandScore> {
	tripsCards: PlayingCard[] = [];

	/**
	 * Create new Trip score
	 *
	 * @param hand PlayerHand
	 * @param trips PlayingCard[]
	 */
	constructor(hand: PlayerHand, trips: PlayingCard[]) {
		super(hand.cards.filter((card) => ![...trips].includes(card)));
		this.score = HandScore.THREE_OF_A_KIND;
		this.tripsCards = trips;
	}

	/**
	 * Beats other rank
	 *
	 * @param opponent HandRank
	 *
	 * @returns number
	 */
	beats = (opponent: HandRank): number => {
		if (opponent instanceof Trips) {
			if (this.solve(opponent) === 0) {
				return this.beatsKickers(opponent);
			} else {
				return this.solve(opponent);
			}
		}

		return super.beats(opponent);
	};

	/**
	 * Solve comparison between two three of a kind ranks
	 *
	 * @param opponent Trips
	 *
	 * @returns number
	 */
	private solve(opponent: Trips): number {
		return this.tripsCards[0].compareTo(opponent.tripsCards[0]);
	}

	/**
	 * Print trips as string
	 *
	 * @returns string
	 */
	print = (): string => {
		return `Three of a kind: ${this.tripsCards.map((card) => card.print()).join(' and ')}`.trim();
	};

	/**
	 * Get trips cards
	 *
	 * @returns PlayingCard[]
	 */
	getCards = (): PlayingCard[] => this.tripsCards;
}
