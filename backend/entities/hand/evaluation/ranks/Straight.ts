import PlayingCard from '../../../deck/card/PlayingCard';
import PlayerHand, { Rankable } from '../../PlayerHand';
import { HandRank } from '../HandRank';
import { HandScore } from '../HandScore';

export class Straight extends HandRank implements Rankable<Straight, HandScore> {
	straightCards: PlayingCard[];

	constructor(hand: PlayerHand, straightCards: PlayingCard[]) {
		super(hand);
		this.straightCards = this.sort(straightCards);
		this.score = HandScore.STRAIGHT;
	}

	solve(opponent: Straight): number {
		return this.getHighCard().compareTo(opponent.getHighCard());
	}

	beats = (opponent: HandRank): number => {
		if (opponent instanceof Straight) {
			return this.solve(opponent);
		}

		return super.beats(opponent);
	};

	print = (): string => {
		return `Straight: ${this.straightCards.map((card) => card.print()).join(' and ')}`.trim();
	};

	getHighCard = (): PlayingCard => {
		return this.straightCards[this.straightCards.length - 1];
	};
}
