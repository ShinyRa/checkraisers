import PlayingCard from '$lib/backend/entities/poker_rules/deck/card/PlayingCard';
import CardDeck from '$lib/backend/entities/poker_rules/deck/CardDeck';
import Player from '$lib/backend/entities/poker_rules/Player';
import { ActionStack } from '$lib/backend/entities/poker_rules/round/ActionStack';
import { Phase } from '$lib/backend/entities/poker_rules/round/Phase';
import { GameState } from './GameState';

export type Match = {
	state?: GameState;
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
	currentPlayerMove: Player['email'] | false;
	communityCards: PlayingCard[];
	winner: Record<string, any> | null;
	actionStack: ActionStack | null;
	potSize: number;
};
