import PlayingCard from '../../entities/deck/card/PlayingCard';

export enum HandType {
	ROYAL_FLUSH = 10,
	STRAIGHT_FLUSH = 9,
	FOUR_OF_A_KIND = 8,
	FULL_HOUSE = 7,
	FLUSH = 6,
	STRAIGHT = 5,
	THREE_OF_A_KIND = 4,
	TWO_PAIR = 3,
	PAIR = 2,
	HIGH = 1
}

class HandScore {
	highCard: PlayingCard;
	handType: HandType;

	constructor(highCard: PlayingCard, handType: HandType) {
		this.highCard = highCard;
		this.handType = handType;
	}

	print = (): string => `${HandType[this.handType]} with ${this.highCard.getValue()} high`;
}

export default HandScore;
