import Player from '../../Player';
import { PlayerActionEnum } from './PlayerActionEnum';

export class PlayerAction {
	player: Player;
	action: PlayerActionEnum | null;
	chips: number;

	constructor(player: Player, action: PlayerActionEnum, chips?: number) {
		this.player = player;
		this.action = action;
		this.chips = chips ?? 0;
		if (action === PlayerActionEnum.ALLIN) {
			this.chips = player.totalChips;
		}
	}

	print = (): string => {
		return `PlayerAction: ${PlayerActionEnum[this.action]}, with chips: ${this.chips}`;
	};
}
