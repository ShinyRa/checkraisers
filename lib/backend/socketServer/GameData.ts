import { ActionStack } from '../entities/poker_rules/round/ActionStack';
import { Phase } from '../entities/poker_rules/round/Phase';
import { evaluationAPI } from '../entities/poker_rules/round/evaluationAPI';
import CardDeck from '../entities/poker_rules/deck/CardDeck';
import { deckAPI } from '../entities/poker_rules/deck/deckAPI';
import Player from '../entities/poker_rules/Player';
import { PlayerActionEnum } from '../entities/poker_rules/round/action/PlayerActionEnum';
import PlayingCard from '../entities/poker_rules/deck/card/PlayingCard';
import PlayerDAO from '../dao/user/PlayerDAO';

type Match = {
	started?: boolean;
	host?: Player['email'];
	message?: string | null;
	name?: string;
	bigBlind?: number;
	bigBlindIndex?: number;
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

class GameData {
	private roundMessage = {
		started: 'The round has started!',
		paused: 'The round has been paused...',
		resumed: 'The round has been resumed!'
	};
	private matches: Match;
	private playerDAO: PlayerDAO;

	constructor() {
		this.matches = {};
		this.playerDAO = new PlayerDAO();
	}

	/**
	 * Create a new match;
	 *
	 * @param host
	 * @param name
	 * @param bigBlind
	 * @param maxPlayers
	 */
	newMatch = (
		host?: Match['host'],
		matchName?: Match['name'],
		bigBlind?: Match['bigBlind'],
		maxPlayers?: Match['maxPlayers']
	): boolean => {
		if (!this.getSpecificMatch[matchName]) {
			const rounds = {
				deck: {},
				communityCards: [],
				winner: null,
				currentPlayerMove: '',
				phase: Phase.PRE_FLOP,
				actionStack: null,
				potSize: 0
			};
			this.matches[matchName] = {
				started: false,
				host: host,
				message: null,
				name: matchName,
				bigBlind: bigBlind,
				maxPlayers: maxPlayers,
				rounds: rounds,
				players: []
			};
			return true;
		} else {
			return false;
		}
	};

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
			specificMatch.rounds.actionStack = new ActionStack(
				specificMatch.players,
				specificMatch.bigBlind,
				Math.floor(Math.random() * specificMatch.players.length)
			);
			specificMatch.rounds.deck = this.createDeckforMatch(specificMatch);
			specificMatch.rounds.currentPlayerMove = specificMatch.rounds.actionStack.currentPlayerTurn();
			specificMatch.players = this.handOutCards(specificMatch.players, specificMatch.rounds.deck);

			this.matches[matchName] = specificMatch;
			return true;
		} else {
			return false;
		}
	};

	drawCommunityCards = (match: Match): Match => {
		if (match.rounds.communityCards.length < 5) {
			const newCard = match.rounds.deck.draw();
			newCard.reveal();
			match.rounds.communityCards = [...match.rounds.communityCards, newCard];
			return match;
		}
		return match;
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

	resumeMatch = (matchName: string): boolean => {
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

	// playerAction = async (
	// 	email: string,
	// 	matchName: string,
	// 	action: PlayerActionEnum,
	// 	chips?: number
	// ): Promise<boolean> => {
	// 	const specificMatch = this.getSpecificMatch(matchName);
	// 	const player = this.findPlayer(matchName, email);
	// 	if (specificMatch && player) {
	// 		specificMatch.rounds.actionStack.push(player, action, chips);
	// 		specificMatch.rounds.potSize = specificMatch.rounds.actionStack.potSize();
	// 		if (specificMatch.rounds.actionStack.currentPlayerTurn()) {
	// 			specificMatch.rounds.currentPlayerMove =
	// 				specificMatch.rounds.actionStack.currentPlayerTurn();
	// 			this.matches[matchName] = specificMatch;
	// 		} else {
	// 			delete this.matches[matchName];
	// 			this.matches[matchName] = await this.newPhase(specificMatch);
	// 		}
	// 		return true;
	// 	} else {
	// 		return false;
	// 	}
	// };

	playerAction = async (
		email: string,
		matchName: string,
		action: PlayerActionEnum,
		chips?: number
	): Promise<boolean> => {
		const specificMatch = this.getSpecificMatch(matchName);
		const player = this.findPlayer(matchName, email);
		if (specificMatch && player) {
			//Hier zit een bug. de volgorde wordt niet goed bijgehouden met het raisen waarschijnlijk te maken hoe "nextPhase" werkt in de action stack
			chips
				? specificMatch.rounds.actionStack.push(player, action, chips)
				: specificMatch.rounds.actionStack.push(player, action);

			specificMatch.rounds.potSize = specificMatch.rounds.actionStack.potSize();

			if (specificMatch.rounds.actionStack.currentPlayerTurn()) {
				specificMatch.rounds.currentPlayerMove =
					specificMatch.rounds.actionStack.currentPlayerTurn();
				this.matches[matchName] = specificMatch;
			} else {
				delete this.matches[matchName];
				this.matches[matchName] = await this.newPhase(specificMatch);
			}
			return true;
		} else {
			return false;
		}
	};

	//Dit werkt
	replay = async (matchName: string): Promise<void> => {
		const match = this.getSpecificMatch(matchName);
		if (match && match.rounds.phase === Phase.EVALUATE) {
			this.matches[matchName] = this.newRound(match);
		}
	};

	//Hier kan een bug in zitten.
	updatePlayerChips = async (match: Match): Promise<Match> => {
		for (let i = 0; i < match.players.length; i++) {
			const playerIndex = match.rounds.actionStack.findPlayerIndex(match.players[i]);
			const chipsSpent = match.rounds.actionStack.stakes[playerIndex];
			match.players[i].totalChips = match.players[i].totalChips - chipsSpent;
			await this.playerDAO.updateChipAmount(match.players[i].totalChips, match.players[i].email);
			if (match.players[i].email === match.rounds.winner['winner'].email) {
				this.playerDAO.updateChipAmount(
					match.players[i].totalChips + match.rounds.potSize,
					match.players[i].email
				);
				match.players[i].totalChips + match.rounds.potSize;
			}
		}
		return match;
	};

	//Hier zit een bug
	newPhase = async (match: Match): Promise<Match> => {
		if (match.rounds.phase === Phase.RIVER) {
			match.rounds.phase = Phase.EVALUATE;
			match.rounds.currentPlayerMove = '';
			match.rounds.winner = evaluationAPI.evaluate(match.players, match.rounds.communityCards);
			await this.updatePlayerChips(match);
		} else {
			match.rounds.phase += 1;
			//hier zit de bug
			match.rounds.actionStack.nextPhase();
			match.rounds.currentPlayerMove = match.rounds.actionStack.currentPlayerTurn();
			if (match.rounds.phase === Phase.FLOP) {
				this.drawCommunityCards(match);
				this.drawCommunityCards(match);
				this.drawCommunityCards(match);
			} else {
				this.drawCommunityCards(match);
			}
		}
		return match;
	};

	// Dit werkt.
	newRound = (match: Match): Match => {
		delete this.matches[match.name];
		this.newMatch(match.host, match.name, match.bigBlind, match.maxPlayers);
		const newMatch = this.getSpecificMatch(match.name);
		if (newMatch) {
			newMatch.rounds.deck = this.createDeckforMatch(newMatch);
			match.players.forEach((player) => {
				player.hand.cards = [];
			});
			newMatch.players = this.handOutCards(match.players, newMatch.rounds.deck);
			newMatch.rounds.actionStack = new ActionStack(
				match.players,
				match.bigBlind,
				this.findNewBigBlindIndex(match.players, match.bigBlindIndex)
			);
			newMatch.rounds.phase = Phase.PRE_FLOP;
			newMatch.message = this.roundMessage.started;
			newMatch.rounds.potSize = 0;
			newMatch.rounds.communityCards = [];
			newMatch.rounds.currentPlayerMove = newMatch.rounds.actionStack.currentPlayerTurn();
			newMatch.started = true;
			return newMatch;
		}
		return match;
	};

	findNewBigBlindIndex = (players: Player[], bigBlindIndex: number): number => {
		if (bigBlindIndex >= players.length - 1) {
			return 0;
		}
		return bigBlindIndex + 1;
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
		const specificMatch = this.getSpecificMatch(matchName);
		if (specificMatch) {
			for (let i = 0; i < specificMatch.players.length; i++) {
				if (specificMatch.players[i].email === email) {
					return specificMatch.players[i];
				}
			}
			return false;
		} else {
			return false;
		}
	};

	/**
	 * Draw cards from the provided deck and give them to the players.
	 *
	 * @param players
	 * @param deckData
	 */
	handOutCards = (players: Player[], deck: CardDeck): Player[] => {
		players.forEach((player) => {
			[1, 2].forEach(() => player.hand.deal(deck.draw()));
		});
		return players;
	};

	/**
	 * Uses the deckAPI to create a new deck. This deck is given to a specific match
	 *
	 * @param specificMatch
	 */
	createDeckforMatch = (specificMatch: Match): CardDeck => {
		specificMatch.rounds.deck = deckAPI.shuffleDeck().deck;
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
	getMatches = (): Match => {
		return this.matches;
	};
}
export default GameData;
