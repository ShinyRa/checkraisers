import PlayingCard from '../../../deck/card/PlayingCard';
import PlayerHand, { Rankable } from '../../PlayerHand';
import { HandRank } from '../HandRank';
import { HandScore } from '../HandScore';

export class High extends HandRank implements Rankable<HandRank, HandScore> {
	constructor(hand: PlayerHand, cards: PlayingCard[]) {
		super(hand, cards);
		this.solve();
	}

	solve = (): void => {
		const allCards = super.sort(this.cards);

		this.score = HandScore.HIGH;
	};

	beats = (hand: HandRank): boolean => {
		return super.beats(hand);
	};
}
