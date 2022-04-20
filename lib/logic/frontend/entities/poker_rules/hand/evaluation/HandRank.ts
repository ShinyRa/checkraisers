import PlayingCard from '../../deck/card/PlayingCard';
import { type IRankable } from '../IRankable';
import { HandScore } from './HandScore';

export abstract class HandRank implements IRankable<HandRank, HandScore> {
	kickers: PlayingCard[];
	score: HandScore;

	/**
	 * Create a new Evaluation of hand and cards on the table
	 *
	 * @param kickers
	 */
	constructor(kickers: PlayingCard[]) {
		this.kickers = kickers;
	}

	/**
	 * HandRank beats other rank by score
	 *
	 * @param rank
	 * @returns
	 */
	beats(rank: HandRank): number {
		return this.score - rank.score;
	}

	/**
	 * Sort batch of playing cards based on their value
	 *
	 * @param playingCards
	 * @returns
	 */
	sort(playingCards: PlayingCard[]): PlayingCard[] {
		return playingCards.sort((card1, card2) => card1.compareTo(card2));
	}

	/**
	 * Does this rank win by kickers over other rank?
	 *
	 * @param opponent
	 * @returns
	 */
	beatsKickers(opponent: HandRank): number {
		const playerKickers = this.sort(this.kickers).reverse();
		const opponentKickers = this.sort(opponent.kickers).reverse();

		// If our rank has no kickers, it loses to opponent rank
		if (playerKickers.length === 0) {
			return 0;
		}

		// If opponent has no kickers, it loses to our rank
		if (opponentKickers.length === 0) {
			return 1;
		}

		// If kickers are equal, look at our and opponent second kickers
		if (playerKickers[0].compareTo(opponentKickers[0]) === 0) {
			// If we and our opponent have second kickers
			if (playerKickers.length > 1 && opponentKickers.length > 1) {
				return playerKickers[1].compareTo(opponentKickers[1]);
			}
		} else {
			return playerKickers[0].compareTo(opponentKickers[0]);
		}
	}

	/**
	 * Print the rank as string
	 *
	 * @returns string
	 */
	abstract print(): string;

	/**
	 * Get all the cards that make up the rank
	 *
	 * @returns PlayingCard[]
	 */
	abstract getCards(): PlayingCard[];
}
