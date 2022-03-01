import PlayingCard from '../../deck/card/PlayingCard';
import PlayerHand, { Rankable } from '../PlayerHand';
import { HandScore } from './HandScore';

export abstract class HandRank implements Rankable<HandRank, HandScore> {
	cards: PlayingCard[];
	kickers: PlayingCard[];
	score: HandScore;

	constructor(hand: PlayerHand, playingCards: PlayingCard[]) {
		this.cards = playingCards;
		this.kickers = hand.cards;
	}

	abstract solve(): void;

	beats = (rank: HandRank): boolean => this.score - rank.score > 0;

	sort = (playingCards: PlayingCard[]): PlayingCard[] =>
		playingCards.sort((card1, card2) => card1.compareTo(card2));
}
