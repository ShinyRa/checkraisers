import PlayingCard from '../../../deck/card/PlayingCard';
import PlayerHand, { Rankable } from '../../PlayerHand';
import { HandRank } from '../HandRank';
import { HandScore } from '../HandScore';

export class Pair extends HandRank implements Rankable<Pair, HandScore> {
	pairCards: PlayingCard[] = [];

	constructor(hand: PlayerHand, pairCards: PlayingCard[]) {
		super(hand.cards);
		this.score = HandScore.PAIR;
		this.pairCards = pairCards;
	}

	beats = (opponent: HandRank): number => {
		if (opponent instanceof Pair) {
			return this.solve(opponent);
		}

		return super.beats(opponent);
	};

	private solve(opponent: Pair): number {
		return this.pairCards[0].compareTo(opponent.pairCards[0]);
	}

	print = (): string => {
		return `Pair: ${this.pairCards.map((card) => card.print()).join(' and ')}`.trim();
	};
}
