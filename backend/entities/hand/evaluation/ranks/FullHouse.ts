import PlayingCard from '../../../deck/card/PlayingCard';
import { type IRankable } from '../../IRankable';
import { PlayerHand } from '../../PlayerHand';
import { HandRank } from '../HandRank';
import { HandScore } from '../HandScore';

export class FullHouse extends HandRank implements IRankable<FullHouse, HandScore> {
	trips: PlayingCard[];
	pair: PlayingCard[];

	constructor(hand: PlayerHand, trips: PlayingCard[], pair: PlayingCard[]) {
		super(hand.cards.filter((card) => ![...trips, ...pair].includes(card)));
		this.trips = trips;
		this.pair = pair;
		this.score = HandScore.FULL_HOUSE;
	}

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

	private solve(opponent: FullHouse): number {
		return this.getTrips().compareTo(opponent.getTrips());
	}

	print = (): string => {
		return `Full house: Trips: ${this.trips
			.map((card) => card.print())
			.join(' and ')}, Pair: ${this.pair.map((card) => card.print()).join(' and ')}
        `.trim();
	};

	getTrips = (): PlayingCard => {
		return this.trips[this.trips.length - 1];
	};

	getCards = (): PlayingCard[] => [...this.trips, ...this.pair];
}
