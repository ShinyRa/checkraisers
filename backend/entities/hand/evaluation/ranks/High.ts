import PlayingCard from '../../../deck/card/PlayingCard';
import PlayerHand, { Rankable } from '../../PlayerHand';
import { HandRank } from '../HandRank';
import { HandScore } from '../HandScore';

export class High extends HandRank implements Rankable<High, HandScore> {
	highCard: PlayingCard;

	constructor(hand: PlayerHand, high: PlayingCard) {
		super(hand);
		this.highCard = high;
		this.score = HandScore.HIGH;
	}

	solve(opponent: High): number {
		return this.highCard.compareTo(opponent.highCard);
	}

	beats = (opponent: HandRank): number => {
		if (opponent instanceof High) {
			return this.solve(opponent);
		}

		return super.beats(opponent);
	};

	print = (): string => {
		return `High card: ${this.highCard.print()}`;
	};
}
