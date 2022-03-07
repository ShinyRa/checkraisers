import PlayingCard from '../../../deck/card/PlayingCard';
import PlayerHand, { Rankable } from '../../PlayerHand';
import { HandRank } from '../HandRank';
import { HandScore } from '../HandScore';

export class Trips extends HandRank implements Rankable<Trips, HandScore> {
	trips: PlayingCard[] = [];

	constructor(hand: PlayerHand, trips: PlayingCard[]) {
		super(hand);
		this.trips = trips;
		this.score = HandScore.THREE_OF_A_KIND;
	}

	solve(opponent: Trips): number {
		return this.trips[0].compareTo(opponent.trips[0]);
	}

	beats = (opponent: HandRank): number => {
		if (opponent instanceof Trips) {
			return this.solve(opponent);
		}

		return super.beats(opponent);
	};

	print = (): string => {
		return `Three of a kind: ${this.trips.map((card) => card.print()).join(' and ')}`.trim();
	};
}
