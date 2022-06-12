import Player from '$lib/backend/entities/poker_rules/Player';
import { PlayerActionEnum } from '$lib/backend/entities/poker_rules/round/action/PlayerActionEnum';
import { ActionStack } from '$lib/backend/entities/poker_rules/round/ActionStack';

let stack;
const players = [
	new Player('email', 'Player', 'asdf', 2000),
	new Player('email', 'Player 2', 'asdf', 1000)
];
players[0].totalChips = 2000;
players[1].totalChips = 1000;

beforeEach(() => {
	stack = new ActionStack(players);
});

describe('ActionStack unit tests', () => {
	it('should track the correct amount of actions taken', () => {
		stack.push(players[0], PlayerActionEnum.CALL);
		stack.push(players[1], PlayerActionEnum.CALL);

		expect(stack.length()).toEqual(2);
	});

	it('should track the correct potsize for all actions', () => {
		stack.push(players[0], PlayerActionEnum.RAISE, 200);
		stack.push(players[1], PlayerActionEnum.RAISE, 200);
		console.log(stack);

		expect(stack.potSize()).toEqual(600);
	});

	it('should be able to determine certain properties of the action stack', () => {
		stack.push(players[0], PlayerActionEnum.RAISE, 2000);
		stack.push(players[1], PlayerActionEnum.ALLIN);
		expect(stack.length()).toEqual(3);
		expect(stack.potSize()).toEqual(3000);
	});

	// it('should be add pending playeractions succesfully', () => {
	// 	stack.push(players[0], PlayerActionEnum.RAISE, 2000);
	// 	stack.push(players[1], PlayerActionEnum.ALLIN);

	// 	expect(stack.length()).toEqual(3);
	// 	expect(stack.actions[0].chips).toEqual(2000);
	// 	expect(stack.actions[1].chips).toEqual(1000);
	// });
});
