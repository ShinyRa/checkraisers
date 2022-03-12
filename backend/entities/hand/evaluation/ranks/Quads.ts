import PlayingCard from '../../../deck/card/PlayingCard';
import { PlayerHand } from '../../PlayerHand';
import { HandRank } from '../HandRank';
import { HandScore } from '../HandScore';

export class Quads extends HandRank implements IRankable<Quads, HandScore> {
	quads: PlayingCard[] = [];

	constructor(hand: PlayerHand, quads: PlayingCard[]) {
		super(hand.cards.filter((card) => ![...quads].includes(card)));
		this.quads = quads;
		this.score = HandScore.FOUR_OF_A_KIND;
	}

	beats = (opponent: HandRank): number => {
		if (opponent instanceof Quads) {
			if (this.solve(opponent) === 0) {
				return this.beatsKickers(opponent);
			} else {
				return this.solve(opponent);
			}
		}

		return super.beats(opponent);
	};

	private solve(opponent: Quads): number {
		return this.getQuad().compareTo(opponent.getQuad());
	}

	print = (): string => {
		return `Four of a kind: ${this.quads.map((card) => card.print()).join(' and ')}`.trim();
	};

	getQuad = (): PlayingCard => {
		return this.quads[this.quads.length - 1];
	};

	getCards = (): PlayingCard[] => this.quads;
}
