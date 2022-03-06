import { CardSuit } from '../../entities/deck/card/CardSuit';
import { CardValue } from '../../entities/deck/card/CardValue';
import PlayingCard from '../../entities/deck/card/PlayingCard';
import PlayerHand from '../../entities/hand/PlayerHand';
import { HandRank } from '../../entities/hand/evaluation/HandRank';
import { High, Pair } from '../../entities/hand/evaluation/ranks';

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

		console.log(pairs);

		if (pairs === 1) {
			return new Pair(hand, valueScoring.filter(()));
		}

		return new High(hand);

		// const isFlush = suitScoring.find((suit) => suit >= 5) > 0;

		// if (amountOfPairs === 1) {
		// 	rank = HandRank.PAIR;
		// }
		// if (amountOfPairs === 2) {
		// 	rank = HandRank.TWO_PAIR;
		// }
		// if (amountOfTrips === 1) {
		// 	rank = HandRank.THREE_OF_A_KIND;
		// }
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

	private static createScoringArray = (enumObject): Array<Array<PlayingCard | null>> =>
		new Array(Object.keys(enumObject).filter((key) => !isNaN(Number(enumObject[key]))).length).fill(
			[]
		);
}

export default HandEvaluation;
