import CardDeck from '../entities/poker_rules/deck/CardDeck';
import { deckAPI } from '../entities/poker_rules/deck/deckAPI';
import Player from '../entities/poker_rules/Player';
import { PlayerActionEnum } from '../entities/poker_rules/round/action/PlayerActionEnum';
import { ActionStack } from '../entities/poker_rules/round/ActionStack';
import { Phase } from '../entities/poker_rules/round/Phase';

type Match = {
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
	deck: Record<string, CardDeck>;
	phase: Phase;
	roundsPlayed: number;
	currentPlayerMove: Player['email'] | false;
	actionStack: ActionStack | null;
	potSize: number;
};

class GameData {
	private roundMessage = {
		started: 'The round has started!',
		paused: 'The round has been paused...',
		resumed: 'The round has been resumed!'
	};
	private matches: Match;

	/**
	 * Create new match object.
	 *
	 * @param host
	 * @param name
	 * @param bigBlind
	 * @param maxPlayers
	 */
	constructor(
		host: Match['host'],
		matchName: Match['name'],
		bigBlind: Match['bigBlind'],
		maxPlayers: Match['maxPlayers']
	) {
		const rounds = {
			deck: {},
			currentPlayerMove: '',
			phase: Phase.PRE_FLOP,
			roundsPlayed: 0,
			actionStack: null,
			potSize: 0
		};
		this.matches = {
			started: false,
			host: host,
			message: null,
			name: matchName,
			bigBlind: bigBlind,
			maxPlayers: maxPlayers,
			rounds: rounds,
			players: []
		};
	}

	/**
	 * Adds data to the previously created match. If "MatchData" returns no match object, the function return false.
	 *
	 * TODO check if email provided is the host of match
	 *
	 * @param matchName
	 */
	startMatch = (matchName: string): boolean => {
		const specificMatch = this.getSpecificMatch(matchName);
		if (specificMatch) {
			specificMatch.message = this.roundMessage.started;
			specificMatch.started = true;
			specificMatch.rounds.actionStack = new ActionStack(specificMatch.players);
			specificMatch.rounds.deck = this.createDeckforMatch(specificMatch);
			specificMatch.rounds.currentPlayerMove = specificMatch.rounds.actionStack.currentPlayerTurn();
			specificMatch.players = this.handOutCards(specificMatch.players, specificMatch.rounds.deck);
			this.matches[matchName] = specificMatch;
			return true;
		} else {
			return false;
		}
	};

	deleteMatch = (matchName: string): boolean => {
		const specificMatch = this.getSpecificMatch(matchName);
		if (specificMatch) {
			delete this.matches[matchName];
		} else {
			return false;
		}
	};

	pauseMatch = (matchName: string): boolean => {
		const specificMatch = this.getSpecificMatch(matchName);
		if (specificMatch) {
			specificMatch.message = this.roundMessage.paused;
			this.matches[matchName] = specificMatch;
		} else {
			return false;
		}
	};

	ResumeMatch = (matchName: string): boolean => {
		const specificMatch = this.getSpecificMatch(matchName);
		if (specificMatch) {
			specificMatch.message = this.roundMessage.resumed;
			this.matches[matchName] = specificMatch;
		} else {
			return false;
		}
	};

	addPlayerToMatch = (matchName: string, player: Player): boolean => {
		const specificMatch = this.getSpecificMatch(matchName);
		if (specificMatch) {
			specificMatch.players.push(player);
			this.matches[matchName] = specificMatch;
			return true;
		} else {
			return false;
		}
	};

	playerAction = (
		email: string,
		matchName: string,
		action: PlayerActionEnum,
		chips?: number
	): boolean => {
		let specificMatch = this.getSpecificMatch(matchName);
		const player = this.findPlayer(matchName, email);
		if (specificMatch && player) {
			specificMatch.rounds.actionStack.push(player, action, chips);
			specificMatch.rounds.potSize = specificMatch.rounds.actionStack.potSize();

			if (specificMatch.rounds.actionStack.currentPlayerTurn()) {
				specificMatch.rounds.currentPlayerMove =
					specificMatch.rounds.actionStack.currentPlayerTurn();
			} else {
				if (specificMatch.rounds.phase !== 4) {
					specificMatch = this.newPhase(specificMatch);
				} else {
					specificMatch = this.newRound(specificMatch);
				}
			}
			this.matches[matchName] = specificMatch;
			return true;
		} else {
			return false;
		}
	};

	newPhase = (match: Match): Match => {
		if (match.rounds.phase === Phase.SHOWDOWN) {
			match.rounds.phase = Phase.PRE_FLOP;
		} else {
			match.rounds.phase += 1;
		}
		match.rounds.actionStack.nextPhase();
		match.rounds.currentPlayerMove = match.rounds.actionStack.currentPlayerTurn();
		return match;
	};

	newRound = (match: Match): Match => {
		match.rounds.actionStack = new ActionStack(match.players);
		match.rounds.phase = Phase.PRE_FLOP;
		match.rounds.potSize = 0;
		match.rounds.currentPlayerMove = match.rounds.actionStack.currentPlayerTurn();
		return match;
	};

	leaveMatch = (matchName: string, email: string): boolean => {
		const specificMatch = this.getSpecificMatch(matchName);
		if (specificMatch) {
			for (let i = 0; i < specificMatch.players.length; i++) {
				if (specificMatch.players[i].email === email) {
					specificMatch.players.splice(i, 1);
					this.matches[matchName] = specificMatch;
					return true;
				}
			}
			return false;
		} else {
			return false;
		}
	};

	findPlayer = (matchName: string, email: string): Player | false => {
		let res: Player | false = false;
		const specificMatch = this.getSpecificMatch(matchName);
		if (specificMatch) {
			specificMatch.players.forEach((player) => {
				if (player.email === email) res = player;
			});
		} else {
			return false;
		}
		return res;
	};

	/**
	 * Draw cards from the provided deck and give them to the players.
	 *
	 * @param players
	 * @param deckData
	 */
	handOutCards = (players: Player[], deckData: Record<string, CardDeck>): Player[] => {
		players.forEach((player) => {
			[1, 2].forEach(() => player.hand.deal(deckData.deck.draw()));
		});
		return players;
	};

	/**
	 * Uses the deckAPI to create a new deck. This deck is given to a specific match
	 *
	 * @param specificMatch
	 */
	createDeckforMatch = (specificMatch: Match): Record<string, CardDeck> => {
		specificMatch.rounds.deck = deckAPI.shuffleDeck();
		return specificMatch.rounds.deck;
	};

	/**
	 * Return a specific match that corresponds with the given "MatchName". If no results, return false.
	 *
	 * @param specificMatch
	 */
	getSpecificMatch = (matchName: string): Match | false => {
		const specificMatch = this.matches[matchName];
		if (specificMatch) {
			return specificMatch;
		} else {
			return false;
		}
	};

	/**
	 * Gets the Match object.
	 *
	 * @param specificMatch
	 */
	getMatches = (): Match | false => {
		if (this.matches) {
			return this.matches;
		} else {
			return false;
		}
	};
}
export default GameData;
