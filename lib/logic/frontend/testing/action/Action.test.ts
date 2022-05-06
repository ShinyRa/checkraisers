import { Action } from '../../entities/poker_rules/round/action/Action';
import { PlayerAction } from '../../entities/poker_rules/round/action/PlacerAction';

describe('Player action unit tests', () => {
	it('should be created succesfully', () => {
		const action = new Action(PlayerAction.FOLD);
		expect(action).toBeTruthy();
	});

	it('should print correctly', () => {
		const action = new Action(PlayerAction.FOLD);
		expect(action.print()).toEqual('PlayerAction: FOLD');
	});
});
