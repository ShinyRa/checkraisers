import PlayingCard from '../../../deck/card/PlayingCard';
import PlayerHand, { Rankable } from '../../PlayerHand';
import { HandRank } from '../HandRank';
import { HandScore } from '../HandScore';

export class Quads extends HandRank implements Rankable<Quads, HandScore> {
	quads: PlayingCard[] = [];

	constructor(hand: PlayerHand, quads: PlayingCard[]) {
		super(hand.cards);
		this.quads = quads;
		this.score = HandScore.FOUR_OF_A_KIND;
	}

	beats = (opponent: HandRank): number => {
		if (opponent instanceof Quads) {
			return this.solve(opponent);
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
}
