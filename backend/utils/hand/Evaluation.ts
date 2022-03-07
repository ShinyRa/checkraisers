import { CardValue } from '../../entities/deck/card/CardValue';
import PlayingCard from '../../entities/deck/card/PlayingCard';
import PlayerHand from '../../entities/hand/PlayerHand';
import { HandRank } from '../../entities/hand/evaluation/HandRank';
import { High, Pair } from '../../entities/hand/evaluation/ranks';
import { TwoPair } from '../../entities/hand/evaluation/ranks/TwoPair';
import { Trips } from '../../entities/hand/evaluation/ranks/Trips';

class HandEvaluation {
	static findScore = (tableCards: PlayingCard[], hand: PlayerHand): HandRank => {
		const allCards = [...hand.cards, ...tableCards];
		allCards.sort((card1, card2) => card1.compareTo(card2));

		const valueScoring = this.createScoringArray(CardValue);

		allCards.forEach(
			(card) => (valueScoring[card.value - 2] = [...valueScoring[card.value - 2], card])
		);

		const suitScoring = this.createScoringArray(CardValue);
		allCards.forEach(
			(card) => (suitScoring[card.suit - 1] = [...suitScoring[card.suit - 1], card])
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

		if (pairs === 1) {
			return new Pair(hand, this.findPair(valueScoring));
		}

		if (pairs === 2) {
			const [lowPair, highPair] = this.findTwoPair(valueScoring);
			return new TwoPair(hand, highPair, lowPair);
		}

		if (trips === 1) {
			return new Trips(hand, this.findTrips(valueScoring));
		}

		const flat = valueScoring.flat();

		return new High(hand, flat[flat.length - 1]);

		// const isFlush = suitScoring.find((suit) => suit >= 5) > 0;

		// if (amountOfPairs === 1 && amountOfTrips === 1) {
		// 	rank = HandRank.FULL_HOUSE;
		// }
		// if (amountOfQuads === 1) {
		// 	rank = HandRank.FOUR_OF_A_KIND;
		// }
		// if (isFlush) {
		// 	rank = HandRank.FLUSH;
		// }

		// console.log(valueScoring);
		// console.log(suitScoring);

		// const score = new HandScore(highCard, handType);

		// console.log(score.print());

		// allCards.forEach((card) => console.log(card.print()));
		return;
	};

	private static findPair = (valueScoring): PlayingCard[] =>
		valueScoring.filter((value) => value.length === 2)[0];

	private static findTwoPair = (valueScoring): PlayingCard[][] =>
		valueScoring.filter((value) => value.length === 2);

	private static findTrips = (valueScoring): PlayingCard[] =>
		valueScoring.filter((value) => value.length === 3)[0];

	private static createScoringArray = (enumObject): Array<Array<PlayingCard | null>> =>
		new Array(Object.keys(enumObject).filter((key) => !isNaN(Number(enumObject[key]))).length).fill(
			[]
		);
}

export default HandEvaluation;
