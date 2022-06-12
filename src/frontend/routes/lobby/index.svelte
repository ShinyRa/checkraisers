<script context="module">
	export async function load({ session }) {
		if (!session.authenticated) {
			return {
				status: 302,
				redirect: '/'
			};
		}
		const socket = get(socketStore);
		return {};
	}
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { assets as assetsPath } from '$app/paths';
	import { session } from '$app/stores';
	import { socketStore } from '$lib/logic/frontend/entities/stores';
	import { onMount } from 'svelte';
	import { get, writable, type Writable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import Match from './Match.svelte';

	let matchName;
	let matches: Writable<Array<string>> = writable([]);
	let overlay = false;

	onMount(() => {
		$socketStore.emit('join-lobby');
	});

	const createGame = () => {
		if (matchName) {
			$socketStore.emit('new-match', {
				host: $session['email'],
				matchName: matchName,
				bigBlind: $bigBlindAmount,
				maxPlayers: $playerMatchAmount
			});
		}
		popup();
	};

	const popup = () => {
		overlay = !overlay;
	};

	const joinGame = (matchName) => {
		goto(`/lobby/match/${matchName}`);
	};

	$socketStore.on('matches-list', (data) => {
		$matches = Object.values(data);
	});

	const MAX_PLAYERS = 6;
	const MIN_PLAYERS = 2;
	const MAX_BIG_BLIND = 1000;
	const MIN_BIG_BLIND = 25;

	const playerMatchAmount = writable(MIN_PLAYERS);
	const bigBlindAmount = writable(MIN_BIG_BLIND);

	const playerAmountHandler = (maxplayerInput: number) => {
		playerMatchAmount.set(
			maxplayerInput <= MAX_PLAYERS && maxplayerInput >= MIN_PLAYERS ? maxplayerInput : MAX_PLAYERS
		);
	};

	const bigBlindAmountHandler = (bigBlindInput: number) => {
		bigBlindAmount.set(
			bigBlindInput <= MAX_BIG_BLIND && bigBlindInput >= MIN_BIG_BLIND
				? bigBlindInput
				: MIN_BIG_BLIND
		);
	};
</script>

<section class="background" style={'background-image: url(' + assetsPath + '/wood_floor.jpg)'}>
	{#if overlay}
		<div class="modal is-active" transition:fade>
			<div class="modal-background" />
			<div class="modal-content">
				<section class="nes-container with-title popup">
					<p class="title">New table</p>
					<div class="nes-field">
						<label for="matchName">Name</label>
						<input
							class="nes-input"
							name="matchName"
							bind:value={matchName}
							placeholder="game name"
							required
						/>
					</div>

					<div class="nes-field">
						<label for="bigBlind">Big blind</label>
						<input
							on:change={(change) => bigBlindAmountHandler(parseInt(change.currentTarget.value))}
							class="nes-input"
							name="bigBlind"
							type="number"
							bind:value={$bigBlindAmount}
							min={MIN_BIG_BLIND}
							max={MAX_BIG_BLIND}
							placeholder="big blind"
							required
						/>
					</div>

					<div class="nes-field">
						<label for="maxPlayers">Max players</label>
						<input
							on:change={(change) => playerAmountHandler(parseInt(change.currentTarget.value))}
							bind:value={$playerMatchAmount}
							class="nes-input"
							type="number"
							name="maxPlayers"
							placeholder="max players"
							min={MIN_PLAYERS}
							max={MAX_PLAYERS}
							required
						/>
					</div>

					<button class="nes-btn is-primary" on:click={createGame}>Create table</button>
				</section>
			</div>
			<button class="modal-close is-large" on:click={popup} aria-label="close" />
		</div>
	{/if}

	<div class="poker-tables">
		<div class="poker-table nes-pointer">
			<div class="header">
				<div class="game-details" on:click={popup}>
					<img class="match" src={assetsPath + '/table/table_0.png'} />
					<span class="details">+ create new table</span>
				</div>
			</div>
		</div>

		{#each $matches as match}
			<Match
				{match}
				click={() => {
					joinGame(match['name']);
				}}
			/>
		{/each}
	</div>
</section>

<style lang="scss">
	section.background {
		min-height: 100vh;
		width: 100vw;
		margin: 0 auto;
		background-size: 150px;
		image-rendering: pixelated;
	}

	.popup {
		max-height: 30rem;
		width: 100%;
		background: white;
		.nes-field {
			padding: 8px 15px;
		}
		.nes-btn {
			margin: 35px 0px;
			width: 100%;
		}
	}
	.poker-table {
		justify-content: center;
		margin: 25px;
		flex: 1 1 15rem;
		display: flex;
		flex-direction: column;
		text-align: center;
		.header {
			justify-content: center;
			display: flex;
			flex-direction: row;
			margin-bottom: 2rem;
			.game-details {
				display: flex;
				flex-direction: column;
				.match {
					align-self: center;
					height: 200px;
					width: 200px;
					z-index: 2;
				}
				.rug {
					position: absolute;
					left: 0;
					top: -1rem;
					background-repeat: repeat;
					background-size: 15px;
					image-rendering: pixelated;
					height: 110%;
					width: 100%;
					z-index: 0;
				}
				.details {
					padding-top: 25px;
					color: white;
					z-index: 2;
				}
				.player-count {
					position: absolute;
					top: 20%;
					left: 0;
					width: 100%;
					z-index: 2;
					color: white;
				}
			}
		}
		.nes-btn {
			width: 80%;
			margin: 0 auto;
		}

		.hover {
			max-width: auto;
			position: absolute;
			left: 70%;
			top: -15%;
			z-index: 999;
			.picture {
				height: 45px;
				width: 45px;
				border-radius: 100%;
			}
			span {
				font-size: 0.8rem;
			}
		}
	}

	.poker-tables {
		padding: 100px;
		display: flex;
		flex-wrap: wrap;
	}
</style>
