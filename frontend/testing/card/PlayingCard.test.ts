import { render, screen } from '@testing-library/svelte';

import { CardSuit } from '$lib/entities/deck/card/CardSuit';
import { CardValue } from '$lib/entities/deck/card/CardValue';
import { CardState } from '$lib/entities/deck/card/CardState';

import { default as PlayingCardData } from '$lib/entities/deck/card/PlayingCard';
import PlayingCard from '../../routes/card/_PlayingCard.svelte';

let card: PlayingCardData;

beforeAll(() => {
	card = new PlayingCardData(CardSuit.CLUBS, CardValue.ACE);
});

describe('Playingcard unit tests', () => {
	it('should be created', () => {
		expect(card.print()).toBe('ace of clubs');
	});

	it('should flip to reveal its face', () => {
		card.flip();
		expect(card.state).toEqual(CardState.REVEALED);
	});

	it('should display the right asset', () => {
		expect(card.assetName()).toEqual('ace_of_clubs.png');
		render(PlayingCard, { props: { card: card } });

		expect(screen.getByAltText(card.assetName()).getAttribute('src')).toContain('ace_of_clubs.png');
	});
});
