import Player from '../../Player';
import { PlayerActionEnum } from './PlayerActionEnum';

export class PlayerAction {
	player: Player;
	action: PlayerActionEnum;
	chips: number;

	constructor(player: Player, action?: PlayerActionEnum, chips?: number) {
		this.player = player;
		this.action = action ?? PlayerActionEnum.PENDING;
		this.chips = chips ?? 0;
		if (action === PlayerActionEnum.ALLIN) {
			this.chips = player.totalChips;
		}
	}

	print(): string {
		return `PlayerAction: ${this.getType()}, with chips: ${this.chips}`;
	}

	getType(): PlayerActionEnum {
		return this.action;
	}

	isResolved(): boolean {
		return this.action !== PlayerActionEnum.PENDING;
	}
}
