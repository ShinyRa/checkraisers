import Player from '$lib/backend/entities/poker_rules/Player';
import { PlayerAction } from '$lib/backend/entities/poker_rules/round/action/PlayerAction';
import { PlayerActionEnum } from '$lib/backend/entities/poker_rules/round/action/PlayerActionEnum';

const players = [
	new Player('email1', 'Player', 'asdf', 2000),
	new Player('email2', 'Player 2', 'asdf', 1000)
];
describe('Action stack unit tests', () => {
	it('should add the correct number of chips to the pot for folding', () => {
		const action = new PlayerAction(players[0], PlayerActionEnum.FOLD);
		expect(action.chips).toEqual(0);
	});

	it('should add the correct number of chips to the pot for raising', () => {
		const action = new PlayerAction(players[0], PlayerActionEnum.RAISE, 250);
		expect(action.chips).toEqual(250);
	});

	it('should add a unresolved action for a player', () => {
		const unresolved = new PlayerAction(players[0]);
		expect(unresolved.isResolved()).not.toEqual(true);
	});

	it('should be able to determine the type of a player action', () => {
		const action = new PlayerAction(players[0], PlayerActionEnum.CALL);
		expect(action.getType()).toEqual(PlayerActionEnum.CALL);
	});
});
