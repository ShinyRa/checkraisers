import { PlayerHand } from './hand/PlayerHand';
import { PlayerAction } from './round/action/PlayerAction';
class Player {
	email: string;
	username: string;
	profilePicture: string;
	totalChips: number;
	hand: PlayerHand;

	constructor(
		email: string,
		username: string,
		profilePicture: string,
		totalChips: number,
		hand?: PlayerHand
	) {
		this.email = email;
		this.username = username;
		this.profilePicture = profilePicture;
		this.totalChips = totalChips;
		this.hand = hand ? hand : new PlayerHand();
	}

	canTakeAction(action: PlayerAction): boolean {
		return this.totalChips >= action.chips;
	}

	takeAction(action: PlayerAction): void {
		this.totalChips -= action.chips;
	}
}

export default Player;
