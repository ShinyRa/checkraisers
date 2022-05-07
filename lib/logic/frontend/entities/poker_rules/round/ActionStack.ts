import { PlayerAction } from './action/PlayerAction';

export class ActionStack {
	actions: PlayerAction[];

	constructor() {
		this.actions = [];
	}

	push(action: PlayerAction): void {
		this.actions.push(action);
	}

	get length(): number {
		return this.actions.length;
	}

	get potSize(): number {
		return this.actions.reduce((prev, curr) => prev + curr.chips, 0);
	}
}
