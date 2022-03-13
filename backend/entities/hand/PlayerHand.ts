import HandEvaluation from '../../utils/hand/Evaluation';
import PlayingCard from '../deck/card/PlayingCard';
import { HandRank } from './evaluation/HandRank';
import { type IRankable } from './IRankable';

type Hand = {
	cards: PlayingCard[];
};

class PlayerHand implements Hand, IRankable<PlayerHand, HandRank> {
	cards: PlayingCard[];
	score: HandRank;

	/**
	 * Constructor.
	 *
	 * @param cards PlayingCard[]
	 */
	constructor(cards: PlayingCard[] = []) {
		this.cards = cards;
	}

	/**
	 * Deal a set of cards to player hand
	 *
	 * @param cards PlayingCard[]
	 */
	deal = (...cards: PlayingCard[]): void => {
		cards.forEach((card) => this.cards.push(card));
	};

	/**
	 * Reveal all cards from a hand
	 */
	reveal = (): void => {
		this.cards.map((card) => card.reveal());
	};

	/**
	 * Estimate the rank of hand and board cards
	 *
	 * @param board PlayingCard[]
	 */
	estimate = (board: PlayingCard[]): void => {
		this.score = HandEvaluation.findScore(board, this);
	};

	/**
	 * If hand beats opponent hand
	 *
	 * @param hand PlayerHand
	 *
	 * @returns number
	 */
	beats = (hand: PlayerHand): number => {
		if (this.score.beats(hand.score) === 0) {
			return this.score.beatsKickers(hand.score);
		}
		return this.score.beats(hand.score);
	};

	/**
	 * Print cards in hand as string
	 *
	 * @returns string
	 */
	print = (): string => this.cards.map((card) => card.print()).join(' and ');
}

export { PlayerHand };
