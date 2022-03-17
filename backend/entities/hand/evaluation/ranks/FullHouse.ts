import PlayingCard from '../../../deck/card/PlayingCard';
import { type IRankable } from '../../IRankable';
import { PlayerHand } from '../../PlayerHand';
import { HandRank } from '../HandRank';
import { HandScore } from '../HandScore';

export class FullHouse extends HandRank implements IRankable<FullHouse, HandScore> {
	tripsCards: PlayingCard[];
	pairCards: PlayingCard[];

	/**
	 * Create new FullHouse score
	 *
	 * @param hand PlayerHand
	 * @param trips PlayingCard[]
	 * @param pair PlayingCard[]
	 */
	constructor(hand: PlayerHand, trips: PlayingCard[], pair: PlayingCard[]) {
		super(hand.cards.filter((card) => ![...trips, ...pair].includes(card)));
		this.score = HandScore.FULL_HOUSE;
		this.tripsCards = trips;
		this.pairCards = pair;
	}

	/**
	 * Beats other rank
	 *
	 * @param opponent HandRank
	 *
	 * @returns number
	 */
	beats = (opponent: HandRank): number => {
		if (opponent instanceof FullHouse) {
			if (this.solve(opponent) === 0) {
				return this.beatsKickers(opponent);
			} else {
				return this.solve(opponent);
			}
		}

		return super.beats(opponent);
	};

	/**
	 * Solve comparison between two fullhouse ranks
	 *
	 * @param opponent FullHouse
	 *
	 * @returns number
	 */
	private solve(opponent: FullHouse): number {
		if (this.tripsCards[0].compareTo(opponent.tripsCards[0]) === 0) {
			return this.pairCards[0].compareTo(opponent.pairCards[0]);
		}
		return this.tripsCards[0].compareTo(opponent.tripsCards[0]);
	}

	/**
	 * Print fullhouse as string
	 *
	 * @returns string
	 */
	print = (): string => {
		return `Full house: Trips: ${this.tripsCards
			.map((card) => card.print())
			.join(' and ')}, Pair: ${this.pairCards.map((card) => card.print()).join(' and ')}
        `.trim();
	};

	/**
	 * Get fullhouse cards
	 *
	 * @returns PlayingCard[]
	 */
	getCards = (): PlayingCard[] => [...this.tripsCards, ...this.pairCards];
}
