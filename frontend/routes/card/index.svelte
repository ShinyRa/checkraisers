<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { deckAPI } from '$lib/api/deck';
	import { evaluationAPI } from '$lib/api/evaluation';
	import CardDeck from '$lib/entities/deck/CardDeck';
	import { default as PlayerData } from '$lib/entities/user/Player';

	import { default as PlayingCardData } from '$lib/entities/deck/card/PlayingCard';
	import PlayingCard from './_PlayingCard.svelte';
	import Player from './_Player.svelte';

	let deck: CardDeck;
	let shown: Array<PlayingCardData> = [];
	let highlight: Array<PlayingCardData> = [];
	let playerWon = '';
	let playerScore = '';
	let phase = 0;

	let players = [PlayerData.mock(), PlayerData.mock(), PlayerData.mock(), PlayerData.mock()];

	onMount(() => {
		startGame();
	});

	const startGame = () => {
		playerWon = '';
		playerScore = '';
		phase = 0;
		deck = null;
		shown = [];
		highlight = [];
		players = [PlayerData.mock(), PlayerData.mock(), PlayerData.mock(), PlayerData.mock()];
		const data = deckAPI.shuffleDeck();

		deck = data.deck;
		players.forEach((player) => {
			[1, 2].forEach(() => player.hand.deal(deck.draw()));
		});
		players[0].hand.reveal();
		players = players;
	};

	const drawCard = () => {
		if (shown.length < 5 && !deck.isEmpty()) {
			const newCard = deck.draw();
			newCard.reveal();
			shown = [...shown, newCard];
		}
	};

	const nextPhase = () => {
		phase = phase + 1;

		if (phase === 1) {
			[1, 2, 3].forEach(drawCard);
		}
		if (phase === 2) {
			drawCard();
		}
		if (phase === 3) {
			drawCard();
		}
		if (phase === 4) {
			const { winner, winningHand } = evaluationAPI.evaluate(players, shown);
			highlight = winningHand.score.getCards();
			playerWon = `${winner.name} won!`;
			playerScore = winningHand.score.print();

			players.forEach((player, index) => {
				player.hand.reveal();
				players[index] = player;
			});
		}
		if (phase === 5) {
			startGame();
		}
	};

	const phaseName = (phase: number) => {
		switch (phase) {
			case 0:
				return 'Flop';
			case 1:
				return 'Turn';
			case 2:
				return 'River';
			case 3:
				return 'Evaluate';
			case 4:
				return 'Replay';
		}
	};

	const findCard = (highlight: PlayingCardData[], card: PlayingCardData) =>
		highlight.find((highlight: PlayingCardData) => highlight.print() == card.print()) != undefined;
</script>

<section class="board">
	{#each players as player, index}
		<Player {player} you={index === 0} {highlight} />
	{/each}
	{#if phase === 4}
		<section class="help" in:slide={{ duration: 275, easing: quintOut }}>
			<h1>{playerWon}</h1>
			<br />
			<h3>{playerScore}</h3>
		</section>
	{/if}
	<section class="cards">
		<button class="button is-large is-primary" disabled={shown.length >= 6} on:click={nextPhase}
			>{phaseName(phase)}</button
		>
		{#each shown as card}
			<PlayingCard {card} highlight={findCard(highlight, card)} />
		{/each}
	</section>
</section>

<style lang="scss">
	.board {
		display: grid;
		grid-template:
			'player player player'
			'help help help'
			'cards cards cards'
			'you you you';
		grid-template-columns: repeat(3, 0.33fr);
		grid-template-rows: repeat(4, 0.1fr);
		background-color: #e3e3e3;
		height: 100vh;
		width: 100vw;
		padding: 50px;
		row-gap: 100px;

		.help {
			grid-area: help;
			display: flex;
			justify-content: center;
			flex-direction: column;
			text-align: center;
			grid-column-start: 1;
			grid-column-end: 4;
			h1 {
				font-weight: bold;
				font-size: 3em;
			}
			h3 {
				font-size: 2.2em;
			}
		}

		.cards {
			grid-column-start: 1;
			grid-column-end: 4;
			display: grid;
			grid-template-columns: repeat(6, 1fr);
			gap: 15px;

			button {
				height: 100%;
				width: 100%;
			}
		}
	}
</style>
