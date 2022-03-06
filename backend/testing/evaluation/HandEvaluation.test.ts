import { CardSuit } from '../../entities/deck/card/CardSuit';
import { CardValue } from '../../entities/deck/card/CardValue';
import PlayingCard from '../../entities/deck/card/PlayingCard';
import { High, Pair } from '../../entities/hand/evaluation/ranks';
import PlayerHand from '../../entities/hand/PlayerHand';

const playerHand = new PlayerHand();
const opponentHand = new PlayerHand();

const tableCards: PlayingCard[] = [];

beforeAll(() => {
	// opponentHand.deal(new PlayingCard(CardSuit.SPADES, CardValue.JACK));
	// opponentHand.deal(new PlayingCard(CardSuit.SPADES, CardValue.TEN));

	tableCards.push(new PlayingCard(CardSuit.HEARTS, CardValue.TWO));
	tableCards.push(new PlayingCard(CardSuit.HEARTS, CardValue.THREE));
	tableCards.push(new PlayingCard(CardSuit.HEARTS, CardValue.FOUR));
	tableCards.push(new PlayingCard(CardSuit.HEARTS, CardValue.FIVE));
	tableCards.push(new PlayingCard(CardSuit.HEARTS, CardValue.SIX));
});

describe('Hand evaluation unit tests', () => {
	it('should be able to determine that hand score is ace high card', () => {
		playerHand.deal(new PlayingCard(CardSuit.CLUBS, CardValue.KING));
		playerHand.deal(new PlayingCard(CardSuit.CLUBS, CardValue.ACE));

		playerHand.estimate(tableCards);

		// expect(playerHand.score).toBeInstanceOf(High);
		// expect(playerHand.score.print()).toBe('High card: ace of clubs');
	});

	// it('should be able to determine that hand score is a pair of sixes ', () => {
	// 	playerHand.deal(new PlayingCard(CardSuit.CLUBS, CardValue.SIX));
	// 	playerHand.deal(new PlayingCard(CardSuit.CLUBS, CardValue.ACE));

	// 	playerHand.estimate(tableCards);

	// 	expect(playerHand.score).toBeInstanceOf(Pair);
	// 	expect(playerHand.score.print()).toBe('Pair: six');
	// });
});
