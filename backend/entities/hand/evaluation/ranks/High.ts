import PlayingCard from '../../../deck/card/PlayingCard';
import PlayerHand, { Rankable } from '../../PlayerHand';
import { HandRank } from '../HandRank';
import { HandScore } from '../HandScore';

export class High extends HandRank implements Rankable<HandRank, HandScore> {
	highCard: PlayingCard;

	constructor(hand: PlayerHand, high: PlayingCard) {
		super(hand);
		this.highCard = high;
		this.solve();
	}

	solve = (): void => {
		this.score = HandScore.HIGH;
	};

	beats = (hand: HandRank): boolean => {
		return super.beats(hand);
	};

	print = (): string => {
		return `High card: ${this.highCard.print()}`;
	};
}
