import PlayingCard from '../../../deck/card/PlayingCard';
import { type IRankable } from '../../IRankable';
import { PlayerHand } from '../../PlayerHand';
import { HandRank } from '../HandRank';
import { HandScore } from '../HandScore';

export class High extends HandRank implements IRankable<High, HandScore> {
	highCard: PlayingCard;

	constructor(hand: PlayerHand, high: PlayingCard) {
		super(hand.cards);
		this.highCard = high;
		this.score = HandScore.HIGH;
	}

	beats = (opponent: HandRank): number => {
		if (opponent instanceof High) {
			if (this.solve(opponent) === 0) {
				return this.beatsKickers(opponent);
			} else {
				return this.solve(opponent);
			}
		}

		return super.beats(opponent);
	};

	private solve(opponent: High): number {
		return this.highCard.compareTo(opponent.highCard);
	}

	print = (): string => {
		return `High card: ${this.highCard.print()}`;
	};

	getCards = (): PlayingCard[] => [this.highCard];
}
