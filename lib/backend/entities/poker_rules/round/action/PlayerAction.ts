import Player from '../../Player';
import { PlayerActionEnum } from './PlayerActionEnum';

export class PlayerAction {
	player: Player;
	action: PlayerActionEnum;
	chips: number;

	/**
	 * Create new PlayerAction
	 *
	 * @param player Player
	 * @param action PlayerActionEnum
	 * @param chips  number
	 */
	constructor(player: Player, action?: PlayerActionEnum, chips?: number) {
		this.player = player;
		this.action = action ?? PlayerActionEnum.PENDING;
		this.chips = chips ?? 0;
		if (action === PlayerActionEnum.ALLIN) {
			this.chips = player.totalChips;
		}
	}

	/**
	 * Print player action as string
	 *
	 * @returns string
	 */
	print(): string {
		return `PlayerAction: ${this.getType()}, with chips: ${this.chips}`;
	}

	/**
	 * Get type of PlayerAction
	 *
	 * @returns PlayerActionEnum
	 */
	getType(): PlayerActionEnum {
		return this.action;
	}

	/**
	 * If PlayerAction is resolved
	 *
	 * @returns
	 */
	isResolved(): boolean {
		return this.action !== PlayerActionEnum.PENDING;
	}
}
