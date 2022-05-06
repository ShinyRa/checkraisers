import { Action } from './action/Action';

export class ActionQueue {
	actions: Action[];

	constructor() {
		this.actions = [];
	}

	push(action: Action): void {
		this.actions.push(action);
	}
}
