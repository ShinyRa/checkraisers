import PlayingCard from '../../../backend/entities/poker_rules/deck/card/PlayingCard';
import Player from '../../../backend/entities/poker_rules/Player';

export const evaluationAPI = {
	evaluate(players: Player[], table: PlayingCard[]): Record<string, any> {
		const hands = players.map((player) => player.hand);
		hands.map((hand) => hand.estimate(table));
		hands.sort((hand1, hand2) => hand1.beats(hand2));

		return {
			winner: players.filter((player) => player.hand === hands[hands.length - 1])[0],
			// TODO: What if match is a draw?
			winningHand: hands[hands.length - 1]
		};
	}
};
