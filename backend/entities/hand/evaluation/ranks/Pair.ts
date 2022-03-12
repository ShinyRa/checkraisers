import PlayingCard from '../../../deck/card/PlayingCard';
import { PlayerHand } from '../../PlayerHand';
import { HandRank } from '../HandRank';
import { HandScore } from '../HandScore';

export class Pair extends HandRank implements IRankable<Pair, HandScore> {
	pairCards: PlayingCard[] = [];

	constructor(hand: PlayerHand, pairCards: PlayingCard[]) {
		super(hand.cards.filter((card) => ![...pairCards].includes(card)));
		this.score = HandScore.PAIR;
		this.pairCards = pairCards;
	}

	beats = (opponent: HandRank): number => {
		if (opponent instanceof Pair) {
			if (this.solve(opponent) === 0) {
				return this.beatsKickers(opponent);
			} else {
				return this.solve(opponent);
			}
		}

		return super.beats(opponent);
	};

	private solve(opponent: Pair): number {
		return this.pairCards[0].compareTo(opponent.pairCards[0]);
	}

	print = (): string => {
		return `Pair: ${this.pairCards.map((card) => card.print()).join(' and ')}`.trim();
	};

	getCards = (): PlayingCard[] => this.pairCards;
}
