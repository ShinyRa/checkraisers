import { Action } from '../../entities/poker_rules/round/action/Action';
import { PlayerAction } from '../../entities/poker_rules/round/action/PlacerAction';
import { ActionStack } from '../../entities/poker_rules/round/ActionStack';

let stack;
beforeAll(() => {
	stack = new ActionStack();
});

describe('Action stack unit tests', () => {
	it('should add actions to the stack succesfully', () => {
		const action = new Action(PlayerAction.FOLD);
		stack.push(action);
		expect(stack.length).toEqual(1);
	});

	// it('should print correctly', () => {
	// 	const action = new Action(PlayerAction.FOLD);
	// 	expect(action.print()).toEqual('PlayerAction: FOLD');
	// 	expect(action.chips).toEqual(0);
	// });
});
