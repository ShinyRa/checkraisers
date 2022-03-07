import HandEvaluation from '../../utils/hand/Evaluation';
import PlayingCard from '../deck/card/PlayingCard';
import { HandRank } from './evaluation/HandRank';

export type Hand = {
	cards: PlayingCard[];
};

export interface Rankable<H, R> {
	beats: (obj: H) => number;
	score: R;
}

class PlayerHand implements Hand, Rankable<PlayerHand, HandRank> {
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
	 * Deal a card to player hand
	 *
	 * @param card PlayingCard
	 */
	deal = (card: PlayingCard): void => {
		this.cards.push(card);
	};

	/**
	 * Reveal all cards from a hand
	 */
	reveal = (): void => {
		this.cards.forEach((card) => card.reveal());
	};

	estimate = (tableCards: PlayingCard[]): void => {
		this.score = HandEvaluation.findScore(tableCards, this);
	};

	beats = (hand: PlayerHand): number => {
		return this.score.beats(hand.score);
	};

	print = (): string => this.cards.map((card) => card.print()).join(' and ');
}

export default PlayerHand;
