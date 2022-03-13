import PlayingCard from '../../../deck/card/PlayingCard';
import { type IRankable } from '../../IRankable';
import { PlayerHand } from '../../PlayerHand';
import { HandRank } from '../HandRank';
import { HandScore } from '../HandScore';

export class Flush extends HandRank implements IRankable<Flush, HandScore> {
	flushCards: PlayingCard[];

	constructor(hand: PlayerHand, flushCards: PlayingCard[]) {
		super(hand.cards.filter((card) => ![...flushCards].includes(card)));
		this.flushCards = this.sort(flushCards);
		this.score = HandScore.FLUSH;
	}

	beats = (opponent: HandRank): number => {
		if (opponent instanceof Flush) {
			if (this.solve(opponent) === 0) {
				return this.beatsKickers(opponent);
			} else {
				return this.solve(opponent);
			}
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

	getCards = (): PlayingCard[] => this.flushCards;
}
