import { PlayerAction } from './PlacerAction';

export class Action {
	action: PlayerAction | null;
	chips: number;

	constructor(action: PlayerAction, chips?: number) {
		this.action = action;
		this.chips = chips;
	}

	print = (): string => {
		return `PlayerAction: ${PlayerAction[this.action]}`;
	};
}
