import PlayingCard from '../../../deck/card/PlayingCard';
import { PlayerHand } from '../../PlayerHand';
import { HandRank } from '../HandRank';
import { HandScore } from '../HandScore';

export class Straight extends HandRank implements IRankable<Straight, HandScore> {
	straightCards: PlayingCard[];
	isRoyal: boolean;
	isFlush: boolean;

	constructor(hand: PlayerHand, straightCards: PlayingCard[], isFlush = false, isRoyal = false) {
		super(hand.cards.filter((card) => ![...straightCards].includes(card)));
		this.straightCards = this.sort(straightCards);
		this.isFlush = isFlush;
		this.isRoyal = isRoyal;

		this.score = HandScore.STRAIGHT;

		if (isFlush) {
			this.score = HandScore.STRAIGHT_FLUSH;
		}
		if (isRoyal) {
			this.score = HandScore.ROYAL_FLUSH;
		}
	}

	beats = (opponent: HandRank): number => {
		if (opponent instanceof Straight) {
			if (this.solve(opponent) === 0) {
				return this.beatsKickers(opponent);
			} else {
				return this.solve(opponent);
			}
		}
		return super.beats(opponent);
	};

	private solve(opponent: Straight): number {
		return this.getHighCard().compareTo(opponent.getHighCard());
	}

	print = (): string => {
		return `${this.isRoyal ? 'Royal ' : ''}Straight${
			this.isFlush ? ' Flush' : ''
		}: ${this.straightCards.map((card) => card.print()).join(' and ')}`.trim();
	};

	getHighCard = (): PlayingCard => {
		return this.straightCards[this.straightCards.length - 1];
	};

	getCards = (): PlayingCard[] => this.straightCards;
}
