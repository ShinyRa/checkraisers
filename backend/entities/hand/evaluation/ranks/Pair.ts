import PlayingCard from '../../../deck/card/PlayingCard';
import PlayerHand, { Rankable } from '../../PlayerHand';
import { HandRank } from '../HandRank';
import { HandScore } from '../HandScore';

export class Pair extends HandRank implements Rankable<HandRank, HandScore> {
	pairCard;

	constructor(hand: PlayerHand, pairCard: PlayingCard) {
		super(hand);
		this.pairCard = pairCard;
		this.solve();
	}

	solve = (): void => {
		this.score = HandScore.PAIR;
	};

	beats = (hand: HandRank): boolean => {
		return super.beats(hand);
	};

	print = (): string => {
		return `Pair card: ${this.pairCard.print()}`;
	};
}
