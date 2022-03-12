import PlayingCard from '../../deck/card/PlayingCard';
import { HandScore } from './HandScore';

export abstract class HandRank implements IRankable<HandRank, HandScore> {
	kickers: PlayingCard[];
	score: HandScore;

	constructor(kickers: PlayingCard[]) {
		this.kickers = kickers;
	}

	beats(rank: HandRank): number {
		return this.score - rank.score;
	}

	sort(playingCards: PlayingCard[]): PlayingCard[] {
		return playingCards.sort((card1, card2) => card1.compareTo(card2));
	}

	beatsKickers(opponent: HandRank): number {
		const playerKickers = this.sort(this.kickers).reverse();
		const opponentKickers = this.sort(opponent.kickers).reverse();

		if (playerKickers.length === 0) {
			return 0;
		}

		if (opponentKickers.length === 0) {
			return 1;
		}

		if (playerKickers[0].compareTo(opponentKickers[0]) === 0) {
			if (playerKickers.length > 1 && opponentKickers.length > 1) {
				return playerKickers[1].compareTo(opponentKickers[1]);
			}
		} else {
			return playerKickers[0].compareTo(opponentKickers[0]);
		}
	}

	abstract print(): string;

	abstract getCards(): PlayingCard[];
}
