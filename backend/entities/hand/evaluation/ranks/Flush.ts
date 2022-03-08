import PlayingCard from '../../../deck/card/PlayingCard';
import PlayerHand, { Rankable } from '../../PlayerHand';
import { HandRank } from '../HandRank';
import { HandScore } from '../HandScore';

export class Flush extends HandRank implements Rankable<Flush, HandScore> {
	flushCards: PlayingCard[];

	constructor(hand: PlayerHand, flushCards: PlayingCard[]) {
		super(hand);
		this.flushCards = this.sort(flushCards);
		this.score = HandScore.FLUSH;
	}

	beats = (opponent: HandRank): number => {
		if (opponent instanceof Flush) {
			return this.solve(opponent);
		}

		return super.beats(opponent);
	};

	private solve(opponent: Flush): number {
		return this.getHighCard().compareTo(opponent.getHighCard());
	}

	print = (): string => {
		return `Flush: ${this.flushCards.map((card) => card.print()).join(' and ')}`.trim();
	};

	getHighCard = (): PlayingCard => {
		return this.flushCards[this.flushCards.length - 1];
	};
}
