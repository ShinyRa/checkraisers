import PlayingCard from '../../../deck/card/PlayingCard';
import PlayerHand, { Rankable } from '../../PlayerHand';
import { HandRank } from '../HandRank';
import { HandScore } from '../HandScore';

export class TwoPair extends HandRank implements Rankable<TwoPair, HandScore> {
	topPair: PlayingCard[] = [];
	lowPair: PlayingCard[] = [];

	constructor(hand: PlayerHand, topPair: PlayingCard[], lowPair: PlayingCard[]) {
		super(hand.cards);
		this.topPair = topPair;
		this.lowPair = lowPair;
		this.score = HandScore.TWO_PAIR;
	}

	solve(opponent: TwoPair): number {
		return this.topPair[0].compareTo(opponent.topPair[0]);
	}

	beats = (opponent: HandRank): number => {
		if (opponent instanceof TwoPair) {
			return this.solve(opponent);
		}

		return super.beats(opponent);
	};

	print = (): string => {
		return `Two Pair: Top: ${this.topPair
			.map((card) => card.print())
			.join(' and ')}, Low: ${this.lowPair.map((card) => card.print()).join(' and ')}
        `.trim();
	};
}
