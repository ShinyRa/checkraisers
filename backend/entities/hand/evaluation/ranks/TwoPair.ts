import PlayingCard from '../../../deck/card/PlayingCard';
import { PlayerHand } from '../../PlayerHand';
import { HandRank } from '../HandRank';
import { HandScore } from '../HandScore';

export class TwoPair extends HandRank implements IRankable<TwoPair, HandScore> {
	topPair: PlayingCard[] = [];
	lowPair: PlayingCard[] = [];

	constructor(hand: PlayerHand, topPair: PlayingCard[], lowPair: PlayingCard[]) {
		super(hand.cards.filter((card) => ![...topPair, ...lowPair].includes(card)));
		this.topPair = topPair;
		this.lowPair = lowPair;
		this.score = HandScore.TWO_PAIR;
	}

	solve(opponent: TwoPair): number {
		return this.topPair[0].compareTo(opponent.topPair[0]);
	}

	beats = (opponent: HandRank): number => {
		if (opponent instanceof TwoPair) {
			if (this.solve(opponent) === 0) {
				return this.beatsKickers(opponent);
			} else {
				return this.solve(opponent);
			}
		}

		return super.beats(opponent);
	};

	print = (): string => {
		return `Two Pair: Top: ${this.topPair
			.map((card) => card.print())
			.join(' and ')}, Low: ${this.lowPair.map((card) => card.print()).join(' and ')}
        `.trim();
	};

	getCards = (): PlayingCard[] => [...this.topPair, ...this.lowPair];
}
