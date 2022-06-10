import Player from '../Player';
import { PlayerAction } from './action/PlayerAction';
import { PlayerActionEnum } from './action/PlayerActionEnum';

export class ActionStack {
	players: Player[];
	actions: PlayerAction[];
	stakes: number[];
	foldedMask: boolean[];

	/**
	 * Create new ActionStack
	 *
	 * @param players
	 */
	constructor(players: Player[]) {
		this.players = players;
		this.actions = [];
		[...new Array(this.players.length)].forEach((_, i) => {
			this.actions.push(new PlayerAction(this.players[i]));
		});
		this.stakes = [...new Array(this.players.length)].fill(0);
		this.foldedMask = [...new Array(this.players.length)].fill(false);
	}

	/**
	 * get the email of the player whose turn it is.
	 *
	 */
	currentPlayerTurn(): string | false {
		let playerTurn;
		this.actions.forEach((action) => {
			console.log(action);
			if (action.action === PlayerActionEnum.PENDING) {
				playerTurn = action.player.email;
				return;
			}
		});
		return playerTurn;
	}

	/**
	 * Find the index of player in players array
	 *
	 * @param number
	 */
	findPlayerIndex(player: Player): number {
		return this.players.indexOf(player);
	}

	/**
	 * Push player action to the stack
	 *
	 * @param action PlayerAction
	 */
	push(player: Player, actionEnum: PlayerActionEnum, chips?: number): void {
		const pendingTurns = [];
		const playerIndex = this.findPlayerIndex(player);
		// If player participates in this action stack
		if (!this.players.includes(player)) {
			return;
		}

		// If raised and no chips are provided
		if (actionEnum === PlayerActionEnum.RAISE && chips <= 0) {
			return;
		}

		if (actionEnum === PlayerActionEnum.FOLD) {
			this.foldedMask[playerIndex] = true;
		}

		if (actionEnum === PlayerActionEnum.CALL) {
			chips = this.findCallForPlayer(player);
			this.stakes[playerIndex] += chips;
		}

		if (actionEnum === PlayerActionEnum.ALLIN || actionEnum === PlayerActionEnum.RAISE) {
			chips =
				actionEnum === PlayerActionEnum.ALLIN
					? // I don't like the TSC compiler.
					  parseInt(player.totalChips as unknown as string)
					: chips;
			this.stakes[playerIndex] += chips;
			this.players.map((p) => {
				if (this.hasActionsRemaining(p) && player != p) {
					pendingTurns.push(new PlayerAction(p));
				}
			});
		}

		this.actions.push(new PlayerAction(player, actionEnum, chips));
		pendingTurns.map((action) => this.actions.push(action));
	}

	findCallForPlayer(player: Player): number {
		const playerIndex = this.findPlayerIndex(player);
		const myStakes = this.stakes[playerIndex];
		const highestBid = Math.max(
			...this.stakes.filter((p, index) => index != playerIndex && !this.foldedMask[index])
		);

		const diff = myStakes - highestBid;
		return diff < 0 ? Math.abs(diff) : 0;
	}

	/**
	 * If the player has actions remaining
	 *
	 * @param player Player
	 *
	 * @returns boolean
	 */
	hasActionsRemaining(player: Player): boolean {
		return (
			this.actions.filter(
				(action) =>
					(action.player === player && action.getType() !== PlayerActionEnum.ALLIN) ||
					action.getType() === PlayerActionEnum.FOLD
			).length > 0
		);
	}

	/**
	 * Get number of actions on the stack
	 */

	length(): number {
		return this.actions.length;
	}

	/**
	 * Get combined potsize of the stack
	 */
	potSize(): number {
		return this.stakes.reduce((prev, curr) => prev + curr, 0);
	}
}
