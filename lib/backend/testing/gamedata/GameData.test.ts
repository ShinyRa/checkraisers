
import { GameState } from '$lib/backend/socketServer/GameState';
import GameData from '$lib/backend/socketServer/GameData';
import { Phase } from '$lib/backend/entities/poker_rules/round/Phase';
import type { Match } from '$lib/logic/frontend/components/match/Match';
import Player from './../../entities/poker_rules/Player';

let gameData: GameData;
const player: Player = new Player('demo@gmail.com', 'demoUsername', 'profilePic.png', 1000)
const matchData = {host:'test@gmail.nl', matchName: 'demoMatch', bigBlind:20, maxPlayers: 4}
const newMatch: Match = {
    state: GameState.NOT_STARTED,
    host: matchData.host,
    message: '',
    name: matchData.matchName,
    bigBlind: matchData.bigBlind,
    maxPlayers: matchData.maxPlayers,
    rounds: {
        deck: {},
        communityCards: [],
        winner: null,
        currentPlayerMove: '',
        phase: Phase.PRE_FLOP,
        actionStack: null,
        potSize: 0
    },
    players: []
};

beforeEach(() => {
	gameData = new GameData();
    gameData.newMatch(matchData.host, matchData.matchName, matchData.bigBlind, matchData.maxPlayers)
});

describe('Test GameData Match mutations', () => {

    it('Should create a new match match', () => {
        gameData.newMatch(matchData.host, matchData.matchName, matchData.bigBlind, matchData.maxPlayers)
        expect(gameData.getSpecificMatch(matchData.matchName)).toStrictEqual (newMatch)
	});

    it('New carddeck should be 52 cards', () => {
        const match = gameData.getSpecificMatch(matchData.matchName)
        expect(match).toBeTruthy()

        if(match){
            const cardDeck = gameData.createDeckforMatch(match)
            expect(cardDeck.cards.length).toEqual(52)
        }
    })

    it('Should get all matches', () => {
        expect(Object.keys(gameData.getMatches()).length).toBe(1)
    })

    it('Should add player to a match', () => {
        gameData.addPlayerToMatch(matchData.matchName, player)
        const newMatch: Match = gameData.getSpecificMatch(matchData.matchName) as Match
        expect(newMatch).toBeTruthy()
        if(newMatch){
            expect(newMatch.players.length).toEqual(1)
        }
    })

    it('Should leave a match', () => {
        gameData.addPlayerToMatch(matchData.matchName, player)
        gameData.leaveMatch(matchData.matchName, player.email)
        const newMatch: Match = gameData.getSpecificMatch(matchData.matchName) as Match
        if(newMatch){
            expect(newMatch.players.length).toBe(0)
        }
    })

    it('Should delete a match', () => {
        expect(gameData.getSpecificMatch(matchData.matchName)).toBeTruthy()
        gameData.deleteMatch(matchData.matchName)
        expect(gameData.getSpecificMatch(matchData.matchName)).toBeFalsy()
    })

    it('Should go to the next Phase', () => {
        gameData.addPlayerToMatch(matchData.matchName, player)
        gameData.startMatch(matchData.matchName)
        const match = gameData.getSpecificMatch(matchData.matchName)
        expect(match).toBeTruthy()
        if(match){
            gameData.newPhase(match)
            gameData.newPhase(match)
            const updatedMatch = gameData.getSpecificMatch(matchData.matchName) as Match
            expect(updatedMatch.rounds.phase).toBe(Phase.TURN)
        }

    })

});
