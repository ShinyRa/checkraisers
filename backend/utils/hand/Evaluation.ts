import { CardValue } from '../../entities/deck/card/CardValue';
import PlayingCard from '../../entities/deck/card/PlayingCard';
import PlayerHand from '../../entities/hand/PlayerHand';
import { HandRank } from '../../entities/hand/evaluation/HandRank';
import { FullHouse, High, Pair, Quads, Straight } from '../../entities/hand/evaluation/ranks';
import { TwoPair } from '../../entities/hand/evaluation/ranks/TwoPair';
import { Trips } from '../../entities/hand/evaluation/ranks/Trips';
import { Flush } from '../../entities/hand/evaluation/ranks/Flush';
import { CardSuit } from '../../entities/deck/card/CardSuit';

class HandEvaluation {
	static findScore = (tableCards: PlayingCard[], hand: PlayerHand): HandRank => {
		const allCards = [...hand.cards, ...tableCards];
		allCards.sort((card1, card2) => card1.compareTo(card2));

		const valueScoring = this.createScoringArray(CardValue);

		allCards.forEach(
			(card) => (valueScoring[card.getValue() - 2] = [...valueScoring[card.getValue() - 2], card])
		);

		const suitScoring = this.createScoringArray(CardSuit);
		allCards.forEach(
			(card) => (suitScoring[card.getSuit() - 1] = [...suitScoring[card.getSuit() - 1], card])
		);

		let pairs = 0;
		let trips = 0;
		let quads = 0;

		valueScoring.forEach((value) => {
			if (value.length === 2) {
				pairs++;
			}
			if (value.length === 3) {
				trips++;
			}
			if (value.length === 4) {
				quads++;
			}
		});

		if (this.isStraight(valueScoring)) {
			return new Straight(hand, this.findStraight(valueScoring));
		}

		if (quads === 1) {
			return new Quads(hand, this.findQuads(valueScoring));
		}

		if (trips >= 1 && pairs >= 1) {
			const [triple, double] = this.findFullHouse(valueScoring);

			return new FullHouse(hand, triple, double);
		}

		if (pairs === 1) {
			return new Pair(hand, this.findPair(valueScoring));
		}

		if (pairs >= 2) {
			const [lowPair, highPair] = this.findTwoPair(valueScoring);
			return new TwoPair(hand, highPair, lowPair);
		}

		if (trips >= 1) {
			return new Trips(hand, this.findTrips(valueScoring));
		}

		if (this.isFlush(suitScoring)) {
			return new Flush(hand, this.findFlush(suitScoring));
		}

		const flat = valueScoring.flat();

		return new High(hand, flat[flat.length - 1]);
	};

	private static findPair = (valueScoring): PlayingCard[] =>
		valueScoring.filter((value) => value.length === 2).flat();

	private static findTwoPair = (valueScoring): PlayingCard[][] =>
		valueScoring.filter((value) => value.length === 2);

	private static findTrips = (valueScoring): PlayingCard[] =>
		valueScoring.filter((value) => value.length === 3).flat();

	private static findFlush = (suitScoring): PlayingCard[] =>
		suitScoring.filter((suit) => suit.length >= 5).flat();

	private static isFlush = (suitScoring): boolean =>
		suitScoring.find((suit) => suit.length >= 5) != null;

	private static isStraight = (valueScoring): boolean => this.findStraight(valueScoring) != null;

	private static findStraight = (valueScoring): PlayingCard[] | null => {
		let straight = null;
		// Insert aces in front of the array (It can make a straight with A-2-3-4-5 or 10-J-Q-K-A)
		valueScoring = [valueScoring[valueScoring.length - 1], ...valueScoring];

		const reversed = valueScoring.reverse();
		reversed.forEach((_, index) => {
			if (!straight) {
				const from = index;
				const to = index + 5;

				if (to <= reversed.length) {
					const straightSlice = reversed.slice(from, to);
					if (straightSlice.every((value) => value.length > 0) && straightSlice.length === 5) {
						straight = straightSlice.flat();
					}
				}
			}
		});

		return straight;
	};

	private static findFullHouse = (valueScoring): PlayingCard[][] => [
		valueScoring.filter((value) => value.length === 3).flat(),
		valueScoring.filter((value) => value.length === 2).flat()
	];

	private static findQuads = (valueScoring): PlayingCard[] =>
		valueScoring.filter((value) => value.length === 4).flat();

	private static createScoringArray = (enumObject): Array<Array<PlayingCard | null>> =>
		new Array(Object.keys(enumObject).filter((key) => !isNaN(Number(enumObject[key]))).length).fill(
			[]
		);
}

export default HandEvaluation;
