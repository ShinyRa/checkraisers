import { CardSuit } from '../../entities/deck/card/CardSuit';
import { CardValue } from '../../entities/deck/card/CardValue';
import PlayingCard from '../../entities/deck/card/PlayingCard';
import PlayerHand from '../../entities/hand/PlayerHand';
import HandScore, { HandType } from './Score';

abstract class HandEvaluation {
	static findScore = (hand: PlayerHand, tableCards: PlayingCard[]): HandScore => {
		const allCards = [...hand.cards, ...tableCards];
		allCards.sort((card1, card2) => card1.compareTo(card2));
		const highCard = allCards[allCards.length - 1];
		let handType = HandType.HIGH;

		const valueScoring = this.createScoringArray(CardValue);
		allCards.forEach((card) => valueScoring[card.value - 2]++);

		const suitScoring = this.createScoringArray(CardSuit);
		allCards.forEach((card) => suitScoring[card.suit - 1]++);

		let amountOfPairs = 0;
		let amountOfTrips = 0;
		let amountOfQuads = 0;
		valueScoring.forEach((value) => {
			if (value === 2) {
				amountOfPairs++;
			}
			if (value === 3) {
				amountOfTrips++;
			}
			if (value === 4) {
				amountOfQuads++;
			}
		});

		const isFlush = suitScoring.find((suit) => suit >= 5) > 0;

		if (amountOfPairs === 1) {
			handType = HandType.PAIR;
		}
		if (amountOfPairs === 2) {
			handType = HandType.TWO_PAIR;
		}
		if (amountOfTrips === 1) {
			handType = HandType.THREE_OF_A_KIND;
		}
		if (amountOfPairs === 1 && amountOfTrips === 1) {
			handType = HandType.FULL_HOUSE;
		}
		if (amountOfQuads === 1) {
			handType = HandType.FOUR_OF_A_KIND;
		}
		if (isFlush) {
			handType = HandType.FLUSH;
		}

		console.log(valueScoring);
		console.log(suitScoring);

		const score = new HandScore(highCard, handType);

		console.log(score.print());

		// allCards.forEach((card) => console.log(card.print()));
		return;
	};

	private static createScoringArray = (enumObject): number[] =>
		new Array(Object.keys(enumObject).filter((key) => !isNaN(Number(enumObject[key]))).length).fill(
			0
		);
}

export default HandEvaluation;
