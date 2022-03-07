import { CardSuit } from '../../entities/deck/card/CardSuit';
import { CardValue } from '../../entities/deck/card/CardValue';
import PlayingCard from '../../entities/deck/card/PlayingCard';
import PlayerHand from '../../entities/hand/PlayerHand';

let playerHand = new PlayerHand();
let opponentHand = new PlayerHand();

const tableCards = [];

beforeAll(() => {
	tableCards.push(new PlayingCard(CardSuit.HEARTS, CardValue.TWO));
	tableCards.push(new PlayingCard(CardSuit.HEARTS, CardValue.THREE));
	tableCards.push(new PlayingCard(CardSuit.HEARTS, CardValue.FOUR));
	tableCards.push(new PlayingCard(CardSuit.HEARTS, CardValue.FIVE));
	tableCards.push(new PlayingCard(CardSuit.HEARTS, CardValue.SIX));
});

beforeEach(() => {
	playerHand = new PlayerHand();
	opponentHand = new PlayerHand();
});

describe('Hand evaluation unit tests', () => {
	it('should be able to determine that hand score is ace high card', () => {
		playerHand.deal(new PlayingCard(CardSuit.CLUBS, CardValue.KING));
		playerHand.deal(new PlayingCard(CardSuit.CLUBS, CardValue.ACE));

		playerHand.estimate(tableCards);

		console.log(playerHand.score.print());

		expect(playerHand.score.print()).toBe('High card: ace of clubs');
	});

	it('should be able to determine that hero wins the high card over villain', () => {
		playerHand.deal(new PlayingCard(CardSuit.CLUBS, CardValue.KING));
		playerHand.deal(new PlayingCard(CardSuit.CLUBS, CardValue.ACE));

		opponentHand.deal(new PlayingCard(CardSuit.DIAMONDS, CardValue.TEN));
		opponentHand.deal(new PlayingCard(CardSuit.DIAMONDS, CardValue.NINE));

		playerHand.estimate(tableCards);
		opponentHand.estimate(tableCards);

		expect(opponentHand.score.print()).toBe('High card: ten of diamonds');
		expect(playerHand.beats(opponentHand)).toBeGreaterThanOrEqual(1);
	});

	it('should be able to determine that hand score is pair', () => {
		playerHand.deal(new PlayingCard(CardSuit.CLUBS, CardValue.ACE));
		playerHand.deal(new PlayingCard(CardSuit.CLUBS, CardValue.FOUR));

		playerHand.estimate(tableCards);

		console.log(playerHand.score.print());

		expect(playerHand.score.print()).toBe('Pair: four of clubs and four of hearts');
	});

	it('should be able to determine that hand score is two pair', () => {
		playerHand.deal(new PlayingCard(CardSuit.CLUBS, CardValue.THREE));
		playerHand.deal(new PlayingCard(CardSuit.CLUBS, CardValue.FOUR));

		playerHand.estimate(tableCards);

		console.log(playerHand.score.print());

		expect(playerHand.score.print()).toBe(
			'Two Pair: Top: four of clubs and four of hearts, Low: three of clubs and three of hearts'
		);
	});

	it('should be able to determine that hand score is three of a kind', () => {
		playerHand.deal(new PlayingCard(CardSuit.CLUBS, CardValue.THREE));
		playerHand.deal(new PlayingCard(CardSuit.DIAMONDS, CardValue.THREE));

		playerHand.estimate(tableCards);

		console.log(playerHand.score.print());

		expect(playerHand.score.print()).toBe(
			'Three of a kind: three of clubs and three of diamonds and three of hearts'
		);
	});

	it('should be able to determine that hand score is a straight', () => {
		playerHand.deal(new PlayingCard(CardSuit.CLUBS, CardValue.SEVEN));
		playerHand.deal(new PlayingCard(CardSuit.CLUBS, CardValue.EIGHT));

		playerHand.estimate(tableCards);

		console.log(playerHand.score.print());

		expect(playerHand.score.print()).toBe(
			'Straight: four of hearts and five of hearts and six of hearts and seven of clubs and eight of clubs'
		);
	});
});
