import PlayingCard from '../deck/card/PlayingCard';
import { HandRank } from './evaluation/HandRank';

export type Hand = {
	cards: PlayingCard[];
};

export interface Rankable<H, R> {
	beats: (obj: H) => boolean;
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

	beats = (hand: PlayerHand): boolean => {
		return this.score.beats(hand.score);
	};

	print = (): string => this.cards.map((card) => card.print()).join(' and ');
}

export default PlayerHand;
