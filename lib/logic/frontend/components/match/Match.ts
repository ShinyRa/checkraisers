import PlayingCard from '$lib/backend/entities/poker_rules/deck/card/PlayingCard';
import CardDeck from '$lib/backend/entities/poker_rules/deck/CardDeck';
import Player from '$lib/backend/entities/poker_rules/Player';
import { ActionStack } from '$lib/backend/entities/poker_rules/round/ActionStack';
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
	deck: CardDeck;
	phase: Phase;
	roundsPlayed: number;
	currentPlayerMove: Player['email'] | false;
	communityCards: PlayingCard[];
	actionStack: ActionStack | null;
	potSize: number;
};
