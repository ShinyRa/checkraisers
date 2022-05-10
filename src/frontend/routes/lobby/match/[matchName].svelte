<script context="module">
	export async function load({ session }) {
		if (!session.authenticated) {
			return {
				status: 302,
				redirect: '/'
			};
		}
		return {};
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { deckAPI } from '$lib/logic/api/deck';
	import { evaluationAPI } from '$lib/logic/api/evaluation';
	import CardDeck from '$lib/logic/frontend/entities/poker_rules/deck/CardDeck';
	import Player from '$lib/logic/frontend/entities/poker_rules/Player';
	import { default as PlayingCardData } from '$lib/logic/frontend/entities/poker_rules/deck/card/PlayingCard';
	import { page, session } from '$app/stores';
	import { socketStore, userStore } from '$lib/logic/frontend/entities/stores';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';
	import PlayingCard from '../../../components/card/PlayingCard.svelte';
	
	let deck: CardDeck;
	let shown: Array<PlayingCardData> = [];
	let highlight: Array<PlayingCardData> = [];
	let playerWon = '';
	let playerScore = '';
	let phase = 0;
	let matchData = writable();
	const matchName = $page.params['matchName']

	let players

	$socketStore.emit('join-match', {email: $session['email'],  matchName: matchName})

	const returnToLobby = () => {
		$socketStore.emit('leave-match', {
			matchName: matchName,
			email: $userStore.getUserData().email
		});
		goto('/lobby');
	};

	$socketStore.on('player-joined', (data) => {
		$matchData = data;
		players = [$matchData['players']];
		console.log(players)
		startGame();
	});

	const startGame = () => {
		playerWon = '';
		playerScore = '';
		phase = 0;
		deck = null;
		shown = [];
		highlight = [];
		const data = deckAPI.shuffleDeck();

		deck = data.deck;
		players.forEach((player) => {
			[1, 2].forEach(() => player.hand.deal(deck.draw()));
		});
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

<div class="info">
	<p>Match name: {matchName}</p>
	<button on:click={returnToLobby} class="button leave">leave match</button>
</div>

<section class="board">
	{#if players}
		{#each players as player}
			<section class="player" class:you={player.name === players[0].name}>
				<h1>{player.name}</h1>
				<div class="hand">
					{#each player.hand.cards as card}
						<div class="card-shadow">
							<PlayingCard {card} highlight={findCard(highlight, card)} />
						</div>
					{/each}
				</div>
			</section>
		{/each}
	{/if}
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
	.info {
		justify-content: space-between;
		display: flex;
		font-size: 20px;
		width: 90%;
		position: absolute;
		left: 9%;
	}
	.leave {
		height: 30px;
		color: white;
		background-color: #ff3e00;
		border: 0;
		margin-top: 5px;
	}
	.board {
		margin-top: 40px;
		display: grid;
		grid-template:
			'player player player'
			'help help help'
			'cards cards cards'
			'you you you';
		grid-template-columns: repeat(3, 0.33fr);
		grid-template-rows: repeat(4, 0.25fr);
		background-color: #31663c;
		height: 100%;
		width: 100%;
		padding: 50px;
		row-gap: 125px;

		.player {
			display: flex;
			flex-direction: column;
			grid-area: 'player';
			justify-content: center;
			color: white;
			.hand {
				display: flex;
				flex-direction: row;
				.card-shadow {
					box-shadow: 5px 8px 0px black;
				}
			}
		}

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

		.you {
			grid-area: you;
			grid-column-start: 1;
			grid-column-end: 4;
			justify-content: center;
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
