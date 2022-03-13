import PlayingCard from '../../../deck/card/PlayingCard';
import { type IRankable } from '../../IRankable';
import { PlayerHand } from '../../PlayerHand';
import { HandRank } from '../HandRank';
import { HandScore } from '../HandScore';

export class Trips extends HandRank implements IRankable<Trips, HandScore> {
	trips: PlayingCard[] = [];

	constructor(hand: PlayerHand, trips: PlayingCard[]) {
		super(hand.cards.filter((card) => ![...trips].includes(card)));
		this.trips = trips;
		this.score = HandScore.THREE_OF_A_KIND;
	}

	solve(opponent: Trips): number {
		return this.trips[0].compareTo(opponent.trips[0]);
	}

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

	print = (): string => {
		return `Three of a kind: ${this.trips.map((card) => card.print()).join(' and ')}`.trim();
	};

	getCards = (): PlayingCard[] => this.trips;
}
