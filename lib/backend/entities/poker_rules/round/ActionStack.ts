import Player from '../Player';
import { PlayerAction } from './action/PlayerAction';
import { PlayerActionEnum } from './action/PlayerActionEnum';

export class ActionStack {
	players: Player[];
	actions: PlayerAction[];

	constructor(players: Player[]) {
		this.players = players;
		this.actions = [];
	}

	push(action: PlayerAction): void {
		if (
			action.getType() === PlayerActionEnum.ALLIN ||
			action.getType() === PlayerActionEnum.RAISE
		) {
			// Add turn for every player that did not fold, or is all-in
		}
		this.actions.push(action);
	}

	get length(): number {
		return this.actions.length;
	}

	get potSize(): number {
		return this.actions.reduce((prev, curr) => prev + curr.chips, 0);
	}
}
