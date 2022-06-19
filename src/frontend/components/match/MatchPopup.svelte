<script lang="ts">
	import { writable } from 'svelte/store';
	import { fade } from 'svelte/transition';

	let matchName;
	export let overlay = false;
	export let onSubmit;

	const MAX_PLAYERS = 6;
	const MIN_PLAYERS = 2;
	const MAX_BIG_BLIND = 1000;
	const MIN_BIG_BLIND = 25;

	const popup = () => {
		overlay = !overlay;
	};

	const createGame = () => {
		onSubmit(null, matchName, $bigBlindAmount, $playerMatchAmount);
		overlay = false;
	};

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

{#if overlay}
	<div class="modal" class:is-active={overlay} transition:fade>
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

				<button class="nes-btn is-primary" on:click={() => createGame()}>Create table</button>
			</section>
		</div>
		<button class="modal-close is-large" on:click={popup} aria-label="close" />
	</div>

	<style lang="scss">
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
	</style>
{/if}
