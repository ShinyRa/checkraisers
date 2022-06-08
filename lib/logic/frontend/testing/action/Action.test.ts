import Player from '../../../../backend/entities/poker_rules/Player';
import { PlayerAction } from '../../../../backend/entities/poker_rules/round/action/PlayerAction';
import { PlayerActionEnum } from '../../../../backend/entities/poker_rules/round/action/PlayerActionEnum';
import { ActionStack } from '../../../../backend/entities/poker_rules/round/ActionStack';

let stack;
const players = [Player.mock(), Player.mock()];
players[0].totalChips = 2000;
players[1].totalChips = 1000;

beforeEach(() => {
	stack = new ActionStack(players);
});

describe('Player action unit tests', () => {
	it('should track the correct amount of actions taken', () => {
		stack.push(new PlayerAction(players[0], PlayerActionEnum.CALL, 200));
		stack.push(new PlayerAction(players[1], PlayerActionEnum.CALL, 200));
		expect(stack.length).toEqual(2);
	});

	it('should track the correct potsize for all actions', () => {
		stack.push(new PlayerAction(players[0], PlayerActionEnum.CALL, 200));
		stack.push(new PlayerAction(players[1], PlayerActionEnum.CALL, 200));
		expect(stack.potSize).toEqual(400);
	});

	it('should be created succesfully', () => {
		players.map((player) => {
			const action = new PlayerAction(player, PlayerActionEnum.RAISE, 2000);
			if (player.canTakeAction(action)) {
				stack.push(action);
			} else {
				stack.push(new PlayerAction(player, PlayerActionEnum.ALLIN));
			}
		});
		expect(stack.length).toEqual(2);
		expect(stack.actions[0].chips).toEqual(2000);
		expect(stack.actions[1].chips).toEqual(1000);
	});

	// it('should print correctly', () => {
	// 	const action = new PlayerAction(PlayerActionEnum.FOLD);
	// 	expect(action.print()).toEqual('PlayerAction: FOLD');
	// 	expect(action.chips).toEqual(0);
	// });
});
