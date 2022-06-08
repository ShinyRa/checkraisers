import { PlayerAction } from '../../../../backend/entities/poker_rules/round/action/PlayerAction';
import { PlayerActionEnum } from '../../../../backend/entities/poker_rules/round/action/PlayerActionEnum';
import { ActionStack } from '../../../../backend/entities/poker_rules/round/ActionStack';

// let stack;
// beforeAll(() => {
// 	stack = new ActionStack();
// });

describe('Action stack unit tests', () => {
	// it('should add actions to the stack', () => {
	// 	const action = new PlayerAction(PlayerActionEnum.FOLD);
	// 	stack.push(action);
	// 	expect(stack.length).toEqual(1);
	// });
	// it('should be able to deterimine pot size', () => {
	// 	stack.push(new PlayerAction(PlayerActionEnum.CALL, 50));
	// 	stack.push(new PlayerAction(PlayerActionEnum.CALL, 50));
	// 	stack.push(new PlayerAction(PlayerActionEnum.RAISE, 100));
	// 	stack.push(new PlayerAction(PlayerActionEnum.ALLIN, 2000));
	// 	expect(stack.potSize).toEqual(2200);
	// });
});
