<script context="module">
	export async function load({ session }) {
		session.authenticated = session.authenticated;
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
	import { fade, fly, slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { deckAPI } from '$lib/logic/api/deck';
	import { evaluationAPI } from '$lib/logic/api/evaluation';
	import CardDeck from '$lib/logic/frontend/entities/poker_rules/deck/CardDeck';
	import Player from '$lib/logic/frontend/entities/poker_rules/Player';
	import { default as PlayingCardData } from '$lib/logic/frontend/entities/poker_rules/deck/card/PlayingCard';
	import PlayingCard from '../../components/card/PlayingCard.svelte';
	import { page } from '$app/stores';
	import { socketStore, userStore } from '$lib/logic/frontend/entities/stores';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';
	import { assets as assetsPath } from '$app/paths';

	let deck: CardDeck;
	let shown: Array<PlayingCardData> = [];
	let highlight: Array<PlayingCardData> = [];
	let playerWon = '';
	let playerScore = '';
	let phase = 0;
	let matchData = writable();
	let actionMessage;
	let load;

	let players = [Player.mock(), Player.mock(), Player.mock(), Player.mock()];

	onMount(() => {
		load = true;
		startGame();
	});

	const startGame = () => {
		playerWon = '';
		playerScore = '';
		phase = 0;
		deck = null;
		shown = [];
		highlight = [];
		players = [Player.mock(), Player.mock(), Player.mock(), Player.mock()];
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

	const user = $userStore.getUserData();
	const matchName = $page.params['matchName'];
	$socketStore.emit('join-match', {
		email: user.email,
		username: user.username,
		chips: user.chips,
		matchName: matchName
	});

	const returnToLobby = () => {
		$socketStore.emit('leave-match', {
			matchName: matchName,
			email: $userStore.getUserData().email
		});
		goto('/lobby');
	};

	const takeAction = (action: string, sound: string) => {
		const audio = new Audio(assetsPath + '/audio/' + sound);
		audio.play();
		actionMessage = action;
		nextPhase()
		setTimeout(() => {
			actionMessage = null;
		}, 2500);
	};

	$socketStore.on('player-joined', (data) => {
		$matchData = data;
		console.log(matchData);
	});
</script>

<!-- <div class="info">
	<p>Match name: {matchName}</p>
	<button on:click={returnToLobby} class="button leave">leave match</button>
</div> -->

<section class="board" style={'background-image: url(' + assetsPath + '/rug.png);'}>
	{#each players as player}
		{@const isYou = player.name === players[0].name}
		<section
			class="player"
			class:you={isYou}
			style={isYou ? 'background-image: url(' + assetsPath + '/wood.png)' : ''}
		>
			<h1>{player.name}</h1>
			<div class="hand">
				{#if isYou}
					{#if actionMessage != null}
						<p transition:fade={{ duration: 250 }} class="nes-balloon from-left text-balloon">
							{actionMessage}
						</p>
					{/if}
				{/if}
				{#each player.hand.cards as card}
					<div class="card-shadow">
						<PlayingCard {card} highlight={findCard(highlight, card)} />
					</div>
				{/each}
				{#if isYou}
					<div class="actions">
						<a class="nes-btn" href="#" on:click={() => takeAction('I call', 'call.wav')}
							>Call ($0)</a
						>
						<a class="nes-btn" href="#" on:click={() => takeAction('I fold', 'fold.wav')}>Fold</a>
						<a
							class="nes-btn"
							href="#"
							on:click={() => takeAction('I Raise with $250', 'raise.wav')}>Raise ($250)</a
						>
						<a
							class="nes-btn"
							href="#"
							on:click={() => takeAction("I'm all in for $15.000", 'allin.wav')}>All In ($15000)</a
						>
					</div>
				{/if}
			</div>
		</section>
	{/each}
	<!-- {#if phase === 4} -->
	<section class="help" in:slide={{ duration: 275, easing: quintOut }}>
		{#if load}
			{#each [...new Array(4)] as _, index}
				<img
					in:fly={{ x: 5, y: 35, duration: 1000, delay: index * 200 }}
					src="{assetsPath}/chip_yellow.png"
					class="chip"
					style="position: absolute; left: {0 - index * 3}px; top: {0 - index * 3}px"
				/>
			{/each}
		{/if}
		<!-- <h1>{playerWon}</h1>
			<br />
			<h3>{playerScore}</h3> -->
	</section>
	<!-- {/if} -->
	<section class="cards">
		<button class="nes-btn is-primary" on:click={nextPhase}>{phaseName(phase)}</button>
		{#each shown as card}
			<PlayingCard {card} highlight={findCard(highlight, card)} />
		{/each}
	</section>
</section>

<style lang="scss">
	// .info {
	// 	justify-content: space-between;
	// 	display: flex;
	// 	font-size: 20px;
	// 	width: 90%;
	// 	position: absolute;
	// 	left: 9%;
	// }
	// .leave {
	// 	height: 30px;
	// 	color: white;
	// 	background-color: #ff3e00;
	// 	border: 0;
	// 	margin-top: 5px;
	// }
	.board {
		padding: 50px;
		display: grid;
		grid-template:
			'player player player'
			'help help help'
			'cards cards cards'
			'you you you';
		grid-template-columns: repeat(3, 0.33fr);
		grid-template-rows: repeat(4, 0.25fr);
		height: 100vh;
		width: 100vw;
		color: white;
		image-rendering: pixelated;

		.text-balloon {
			position: absolute;
			top: -150px;
			height: 75px;
			min-width: 125px;
			color: black;
		}

		.player {
			display: flex;
			flex-direction: column;
			grid-area: 'player';
			justify-content: center;
			.hand {
				display: flex;
				flex-direction: row;
				position: relative;
			}
		}

		.card-shadow {
			box-shadow: 5px 8px 0px black;
		}

		.chip {
			image-rendering: pixelated;
			height: 35px;
			width: 35px;
		}
		.help {
			position: relative;
			grid-area: help;
			padding: 25px;
			// display: flex;
			// justify-content: center;
			// flex-direction: column;
			// text-align: center;
			// grid-column-start: 1;
			// grid-column-end: 4;
			// h1 {
			// 	font-weight: bold;
			// 	font-size: 3em;
			// }
			// h3 {
			// 	font-size: 2.2em;
			// }
		}

		.you {
			grid-area: you;
			grid-column-start: 1;
			grid-column-end: 4;
			image-rendering: pixelated;
			height: 200px;
			border: 3px solid black;
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
		.actions {
			padding: 25px;
		}
	}
</style>
