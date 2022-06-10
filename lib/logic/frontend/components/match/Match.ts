import Player from '$lib/backend/entities/poker_rules/Player';
import { Phase } from '$lib/backend/entities/poker_rules/round/Phase';

export type Match = {
	started?: boolean;
	host?: Player['email'];
	message?: string | null;
	name?: string;
	bigBlind?: number;
	maxPlayers?: number;
	rounds?: Round;
	players?: Player[];
};

type Round = {
	phase: Phase;
	roundsPlayed: number;
	potSize: number;
	currentPlayerMove: Player | null;
};
