import type Player from '../Player';
import { PlayerAction } from './action/PlayerAction';
import { PlayerActionEnum } from './action/PlayerActionEnum';
export class ActionStack {
	players: Player[];
	actions: PlayerAction[];
	stakes: number[];
	foldedMask: boolean[];
	bigBlindIndex: number;
	bigBlind: number;

	/**
	 * Create new ActionStack
	 *
	 * @param players
	 */
	constructor(players: Player[], bigBlind: number, bigBlindIndex: number) {
		this.bigBlindIndex = bigBlindIndex;
		this.players = players;
		this.actions = [];
		[...new Array(this.players.length)].forEach((_, i) => {
			this.actions.push(new PlayerAction(this.players[i]));
		});
		this.stakes = [...new Array(this.players.length)].fill(0);
		this.stakes[bigBlindIndex] += bigBlind;
		this.players[bigBlindIndex].totalChips = this.players[bigBlindIndex].totalChips - bigBlind;
		this.foldedMask = [...new Array(this.players.length)].fill(false);
	}

	/**
	 * get the email of the player whose turn it is.
	 *
	 */
	currentPlayerTurn(): string | false {
		for (let i = 0; i < this.actions.length; i++) {
			if (this.actions[i].getType() === PlayerActionEnum.PENDING) {
				return this.actions[i].player.email;
			}
		}
		return false;
	}

	/**
	 * Find the index of player in players array
	 *
	 * @param number
	 */
	findPlayerIndex(player: Player): number {
		return this.players.indexOf(player);
	}

	findCurrentTurnIndex(): number {
		for (let i = 0; i < this.actions.length; i++) {
			if (this.actions[i].getType() === PlayerActionEnum.PENDING) {
				return i;
			}
		}
		return -1;
	}

	getPlayersByTurnOrder(): Player[] {
		const ordered = [];
		let index = this.bigBlindIndex;
		for (let nr = 0; nr < this.players.length; nr++) {
			if (index > this.players.length - 1) {
				index = 0;
			}
			ordered.push(this.players[index]);
			index++;
		}

		return ordered;
	}

	/**
	 * Push player action to the stack
	 *
	 * @param action PlayerAction
	 */
	push(player: Player, actionEnum: PlayerActionEnum, chips?: number): void {
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
			this.actions[this.findCurrentTurnIndex()] = new PlayerAction(player, actionEnum);
		}
		if (actionEnum === PlayerActionEnum.CALL) {
			chips = this.findCallForPlayer(player);
			const playerIndex = this.findPlayerIndex(player);
			this.players[playerIndex].totalChips = this.players[playerIndex].totalChips - chips;
			this.stakes[playerIndex] += chips;
			this.actions[this.findCurrentTurnIndex()] = new PlayerAction(player, actionEnum, chips);
		}
		if (actionEnum === PlayerActionEnum.ALLIN || actionEnum === PlayerActionEnum.RAISE) {
			const playerIndex = this.findPlayerIndex(player);

			chips =
				actionEnum === PlayerActionEnum.ALLIN
					? // I don't like the TSC compiler.
					  parseInt(player.totalChips as unknown as string)
					: chips;
			this.players[playerIndex].totalChips = this.players[playerIndex].totalChips - chips;
			let call = 0;
			if ((call = this.findCallForPlayer(player)) > 0) {
				this.stakes[playerIndex] += call;
				this.players[playerIndex].totalChips = this.players[playerIndex].totalChips - call;
			}
			this.stakes[playerIndex] += chips;
			this.actions[this.findCurrentTurnIndex()] = new PlayerAction(player, actionEnum, chips);

			this.getPlayersByTurnOrder().map((p) => {
				if (this.hasActionsRemaining(p) && player.email != p.email) {
					this.actions.push(new PlayerAction(p));
				}
			});
		}
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

	nextPhase(): void {
		this.getPlayersByTurnOrder().map((player) => {
			if (this.hasActionsRemaining(player)) {
				this.actions.push(new PlayerAction(player));
			}
		});
	}

	/**
	 * If the player has actions remaining
	 *
	 * @param player Player
	 *
	 * @returns boolean
	 */
	hasActionsRemaining(player: Player): boolean {
		const filtered = this.actions.filter((action) => action.player.email == player.email);

		return (
			filtered.filter(
				(action) =>
					action.getType() === PlayerActionEnum.ALLIN ||
					action.getType() === PlayerActionEnum.FOLD ||
					action.getType() === PlayerActionEnum.PENDING
			).length == 0
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
