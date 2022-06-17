import Player from '$lib/backend/entities/poker_rules/Player';
import { PlayerActionEnum } from '$lib/backend/entities/poker_rules/round/action/PlayerActionEnum';
import { ActionStack } from '$lib/backend/entities/poker_rules/round/ActionStack';

const BIG_BLIND = 75;
let stack;
const players = [
	new Player('test@test.nl', 'Player', 'asdf', 2000),
	new Player('help@help.nl', 'Player 2', 'asdf', 1000)
];

beforeEach(() => {
	players[0].totalChips = 2000;
	players[1].totalChips = 1000;
	stack = new ActionStack(players, BIG_BLIND, 1);
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
		stack.push(players[0], PlayerActionEnum.CALL);

		expect(stack.potSize()).toEqual(950);
	});
	it('should be able to determine certain properties of the action stack', () => {
		stack.push(players[0], PlayerActionEnum.FOLD);
		stack.push(players[1], PlayerActionEnum.ALLIN);

		expect(stack.length()).toEqual(2);
		expect(stack.potSize()).toEqual(1000);
	});

	it('should be add pending playeractions succesfully', () => {
		console.log(players[1].totalChips);
		stack.push(players[0], PlayerActionEnum.RAISE, 2000);
		stack.push(players[1], PlayerActionEnum.ALLIN);
		stack.push(players[0], PlayerActionEnum.CALL);

		expect(stack.length()).toEqual(3);
		expect(stack.actions[0].chips).toEqual(2000);
		expect(stack.actions[1].chips).toEqual(925);
	});
});
