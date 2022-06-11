import { FullHouse, High, Pair, Quads, Straight, TwoPair, Trips, Flush } from './evaluation/ranks';

import PlayingCard from '../deck/card/PlayingCard';
import { PlayerHand } from './PlayerHand';
import { HandRank } from './evaluation/HandRank';

import { CardSuit } from '../deck/card/identity/CardSuit';
import { CardValue } from '../deck/card/identity/CardValue';

class HandEvaluation {
	findScore = (tableCards: PlayingCard[], hand: PlayerHand): HandRank => {
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

		if (this.hasStraight(valueScoring)) {
			const straights = this.findStraight(valueScoring);
			const converted = straights.map((straight) => {
				return new Straight(
					hand,
					straight,
					this.straightIsFlush(straight),
					this.straightIsRoyal(straight)
				);
			});

			converted.sort((straight1, straight2) => straight1.beats(straight2));
			return converted[converted.length - 1];
		}

		if (this.isFlush(suitScoring)) {
			return new Flush(hand, this.findFlush(suitScoring));
		}

		if (quads === 1) {
			return new Quads(hand, this.findQuads(valueScoring));
		}

		if (trips >= 1 && pairs >= 1) {
			// TODO: Sort highest with 3 or more
			const [triple, double] = this.findFullHouse(valueScoring);

			return new FullHouse(hand, triple, double);
		}

		if (trips >= 1) {
			return new Trips(hand, this.findTrips(valueScoring));
		}

		if (pairs >= 2) {
			const twoPairs = this.findTwoPair(valueScoring);
			const lowPair = twoPairs[twoPairs.length - 2];
			const highPair = twoPairs[twoPairs.length - 1];
			return new TwoPair(hand, highPair, lowPair);
		}

		if (pairs === 1) {
			return new Pair(hand, this.findPair(valueScoring));
		}

		const flat = valueScoring.flat();

		return new High(hand, flat[flat.length - 1]);
	};

	private findPair = (valueScoring): PlayingCard[] =>
		valueScoring.filter((value) => value.length === 2).flat();

	private findTwoPair = (valueScoring): PlayingCard[][] =>
		valueScoring.filter((value) => value.length === 2);

	private findTrips = (valueScoring): PlayingCard[] =>
		valueScoring.filter((value) => value.length === 3).flat();

	private findFlush = (suitScoring): PlayingCard[] =>
		suitScoring.filter((suit) => suit.length >= 5).flat();

	private isFlush = (suitScoring): boolean => suitScoring.find((suit) => suit.length >= 5) != null;

	private hasStraight = (valueScoring): boolean => this.findStraight(valueScoring).length > 0;

	private straightIsFlush = (valueScoring): boolean => {
		return valueScoring.filter((card) => card.getSuit() == valueScoring[0].getSuit()).length === 5;
	};

	private straightIsRoyal = (valueScoring): boolean => {
		return valueScoring.reduce((acc, card) => acc + card.getValue(), 0) === 60;
	};

	private findStraight = (valueScoring): PlayingCard[][] | null => {
		const straights = [];
		// Insert aces in front of the array (It can make a straight with A-2-3-4-5 or 10-J-Q-K-A)
		valueScoring = [valueScoring[valueScoring.length - 1], ...valueScoring];

		const reversed = valueScoring.reverse();
		reversed.forEach((_, index) => {
			const from = index;
			const to = index + 5;

			if (to <= reversed.length) {
				const straightSlice = reversed.slice(from, to);
				if (straightSlice.every((value) => value.length > 0) && straightSlice.length === 5) {
					straights.push(straightSlice.flat());
				}
			}
		});

		return straights;
	};

	private findFullHouse = (valueScoring): PlayingCard[][] => [
		valueScoring.filter((value) => value.length === 3).flat(),
		valueScoring.filter((value) => value.length === 2).flat()
	];

	private findQuads = (valueScoring): PlayingCard[] =>
		valueScoring.filter((value) => value.length === 4).flat();

	private createScoringArray = (enumObject): Array<Array<PlayingCard | null>> =>
		new Array(Object.keys(enumObject).filter((key) => !isNaN(Number(enumObject[key]))).length).fill(
			[]
		);
}

export default HandEvaluation;
