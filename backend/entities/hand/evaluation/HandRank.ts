import PlayingCard from '../../deck/card/PlayingCard';
import PlayerHand, { Rankable } from '../PlayerHand';
import { HandScore } from './HandScore';

export abstract class HandRank implements Rankable<HandRank, HandScore> {
	kickers: PlayingCard[];
	score: HandScore;

	constructor(hand: PlayerHand) {
		this.kickers = hand.cards;
	}

	abstract print(): string;

	beats(rank: HandRank): number {
		return this.score - rank.score;
	}

	sort(playingCards: PlayingCard[]): PlayingCard[] {
		return playingCards.sort((card1, card2) => card1.compareTo(card2));
	}
}
