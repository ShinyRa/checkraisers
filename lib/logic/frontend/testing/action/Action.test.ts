import { Action } from '../../entities/poker_rules/round/action/Action';
import { PlayerAction } from '../../entities/poker_rules/round/action/PlacerAction';
import { ActionStack } from '../../entities/poker_rules/round/ActionStack';

beforeAll(() => {
	const stack = new ActionStack();
});

describe('Player action unit tests', () => {
	it('should be created succesfully', () => {
		const action = new Action(PlayerAction.FOLD);
		expect(action).toBeTruthy();
	});

	it('should print correctly', () => {
		const action = new Action(PlayerAction.FOLD);
		expect(action.print()).toEqual('PlayerAction: FOLD');
		expect(action.chips).toEqual(0);
	});
});
