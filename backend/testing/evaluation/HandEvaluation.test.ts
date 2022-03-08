import PlayingCard from '../../entities/deck/card/PlayingCard';
import PlayerHand from '../../entities/hand/PlayerHand';

let hero;
let villain;

let board = [];
let player = [];
let opponent = [];

beforeEach(() => {
	board = [];
	player = [];
	opponent = [];

	hero = new PlayerHand();
	villain = new PlayerHand();
});

const mapTemplateToCards = (template: string[]): PlayingCard[] =>
	template.map((card) => new PlayingCard(card));

describe('Hand evaluation unit tests', () => {
	it('should be able to determine that hand score is ace high card', () => {
		board = mapTemplateToCards(['♥2', '♥3', '♥4', '♠6', '♠7']);
		player = mapTemplateToCards(['♣A', '♣Q']);

		hero.deal(...player);
		hero.estimate(board);

		expect(hero.score.print()).toBe('High card: ace of clubs');
	});

	it('should be able to determine that hero wins the high card over villain', () => {
		board = mapTemplateToCards(['♥2', '♥3', '♥4', '♠6', '♠7']);
		player = mapTemplateToCards(['♣A', '♣Q']);
		opponent = mapTemplateToCards(['♦J', '♦10']);

		hero.deal(...player);
		villain.deal(...opponent);

		hero.estimate(board);
		villain.estimate(board);

		expect(hero.score.print()).toBe('High card: ace of clubs');
		expect(villain.score.print()).toBe('High card: jack of diamonds');

		expect(hero.beats(villain)).toBeGreaterThanOrEqual(1);
	});

	it('should be able to determine that hand score is pair', () => {
		board = mapTemplateToCards(['♥2', '♥3', '♥4', '♠6', '♠7']);
		player = mapTemplateToCards(['♦2', '♠J']);

		hero.deal(...player);

		hero.estimate(board);

		expect(hero.score.print()).toBe('Pair: two of diamonds and two of hearts');
	});

	it('should be able to determine that hand score is two pair', () => {
		board = mapTemplateToCards(['♥2', '♥3', '♥4', '♠6', '♠7']);
		player = mapTemplateToCards(['♣2', '♣3']);

		hero.deal(...player);

		hero.estimate(board);

		expect(hero.score.print()).toBe(
			'Two Pair: Top: three of clubs and three of hearts, Low: two of clubs and two of hearts'
		);
	});

	it('should be able to determine that hand score is three of a kind', () => {
		board = mapTemplateToCards(['♥2', '♦2', '♥4', '♠6', '♠7']);
		player = mapTemplateToCards(['♣10', '♣2']);

		hero.deal(...player);

		hero.estimate(board);

		expect(hero.score.print()).toBe(
			'Three of a kind: two of clubs and two of hearts and two of diamonds'
		);
	});

	it('should be able to determine that hand score is a straight', () => {
		board = mapTemplateToCards(['♥A', '♦2', '♥4', '♠5', '♠7']);
		player = mapTemplateToCards(['♣10', '♣3']);

		hero.deal(...player);

		hero.estimate(board);

		expect(hero.score.print()).toBe(
			'Straight: two of diamonds and three of clubs and four of hearts and five of spades and ace of hearts'
		);
	});

	it('should be able to determine that hand score is a flush', () => {
		board = mapTemplateToCards(['♥2', '♥4', '♥5', '♠7', '♥9']);
		player = mapTemplateToCards(['♥10', '♣3']);

		hero.deal(...player);

		hero.estimate(board);

		expect(hero.score.print()).toBe(
			'Flush: two of hearts and four of hearts and five of hearts and nine of hearts and ten of hearts'
		);
	});

	it('should be able to determine that hand score is a full house', () => {
		board = mapTemplateToCards(['♥2', '♠2', '♥5', '♠5', '♥9']);
		player = mapTemplateToCards(['♦5', '♣3']);

		hero.deal(...player);

		hero.estimate(board);

		expect(hero.score.print()).toBe(
			'Full house: Trips: five of diamonds and five of hearts and five of spades, Pair: two of hearts and two of spades'
		);
	});

	it('should be able to determine that hand score is a four of a kind', () => {
		board = mapTemplateToCards(['♦2', '♠2', '♥5', '♠5', '♥9']);
		player = mapTemplateToCards(['♥2', '♣2']);

		hero.deal(...player);

		hero.estimate(board);

		expect(hero.score.print()).toBe(
			'Four of a kind: two of hearts and two of clubs and two of diamonds and two of spades'
		);
	});
});
