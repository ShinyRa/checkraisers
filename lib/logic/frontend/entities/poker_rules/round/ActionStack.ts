import { Action } from './action/Action';

export class ActionStack {
	actions: Action[];

	constructor() {
		this.actions = [];
	}

	push(action: Action): void {
		this.actions.push(action);
	}

	get length(): number {
		return this.actions.length;
	}
}
