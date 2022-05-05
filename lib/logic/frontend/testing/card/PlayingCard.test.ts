import { render, screen } from '@testing-library/svelte';

import { CardState } from '../../entities/poker_rules/deck/card/state/CardState';

import { default as PlayingCardData } from '../../entities/poker_rules/deck/card/PlayingCard';
import PlayingCard from '../../../../../src/frontend/components/card/PlayingCard.svelte';

let card: PlayingCardData;

beforeAll(() => {
	card = new PlayingCardData('♣A');
});

describe('Playingcard unit tests', () => {
	it('should be created', () => {
		expect(card.print()).toBe('ace of clubs');
	});

	it('should not be known to the user before revealed', () => {
		expect(screen.queryByAltText(card.assetName())).toBeFalsy();
	});

	it('should flip to reveal its face', () => {
		card.flip();
		expect(card.state).toEqual(CardState.REVEALED);
	});

	it('should display the right asset', () => {
		expect(card.assetName()).toEqual('ace_of_clubs.png');
		render(PlayingCard, { props: { card: card, highlight: false } });

		expect(screen.getByAltText(card.print()).getAttribute('src')).toContain('ace_of_clubs.png');
	});
});
