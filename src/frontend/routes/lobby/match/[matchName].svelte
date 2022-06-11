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
	import { goto } from '$app/navigation';
	import { page, session } from '$app/stores';
	import { assets as assetsPath } from '$app/paths';
	import { socketStore, userStore } from '$lib/logic/frontend/entities/stores';
	import { writable, type Writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import Player from '$lib/backend/entities/poker_rules/Player';
	import CardHolder from '../../../components/player/CardHolder.svelte';
	import { PlayerHand } from '$lib/backend/entities/poker_rules/hand/PlayerHand';
	import PlayingCard from '$lib/backend/entities/poker_rules/deck/card/PlayingCard';
	import { CardIdentity } from '$lib/backend/entities/poker_rules/deck/card/identity/CardIdentity';
	import { browser } from '$app/env';
	import type { Match } from '$lib/logic/frontend/components/match/Match';
	import { HostState } from '$lib/logic/frontend/components/match/HostState';
	import NotificationMatch from '../../../components/match/NotificationMatch.svelte';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { PlayerActionEnum } from '$lib/backend/entities/poker_rules/round/action/PlayerActionEnum';

	const matchName = $page.params['matchName'];
	let matchData: Writable<Match> = writable();
	let preview: string = `${assetsPath}/avatars/`;
	let raiseAmount = 0;

	const raiseHandler = (amount: number, totalChips: number) => {
		if (amount) {
			raiseAmount = amount > totalChips ? totalChips : amount;
		} else {
			raiseAmount = 0;
		}
	};

	//Rebuilding of the backend Player array
	const rebuildPlayers = (players: Player[]): Player[] => {
		const rebuildHand = (cards: Array<any>): PlayingCard[] => {
			const cardArray: PlayingCard[] = [];
			cards.forEach((card) => {
				cardArray.push(
					new PlayingCard(new CardIdentity(card.identity.suit, card.identity.value), card.state)
				);
			});
			return cardArray;
		};

		let newPlayerArray: Player[] = [];
		players.forEach((player) => {
			const rebuildplayer = new Player(
				player.email,
				player.username,
				player.profilePicture,
				player.totalChips,
				new PlayerHand(rebuildHand(player.hand.cards))
			);
			newPlayerArray.push(rebuildplayer);
		});
		return newPlayerArray;
	};

	//socket io logic below
	onMount(() => {
		console.log('join-match')
		$socketStore.emit('join-match', { email: $session['email'], matchName: matchName });
	});

	const startMatch = async () => {
		$socketStore.emit('start-match', { email: $session['email'], matchName: matchName });
		$matchData.message = HostState.STARTED;
	};

	const pauseMatch = async () => {
		$socketStore.emit('pause-match', { email: $session['email'], matchName: matchName });
		$matchData.message = HostState.PAUSED;
	};

	const stopMatch = () => {
		$socketStore.emit('stop-match', { email: $session['email'], matchName: matchName });
	};

	const resumeMatch = async () => {
		$socketStore.emit('resume-match', { email: $session['email'], matchName: matchName });
		$matchData.message = HostState.STARTED;
	};

	const takeAction = (action: PlayerActionEnum, amount?: number) => {
		const actionObject = amount
			? { playerAction: action, chips: amount }
			: { playerAction: action };
		$socketStore.emit('player-action', {
			email: $session['email'],
			matchName: matchName,
			action: actionObject
		});
	};

	$socketStore.on('match-data', (data) => {
		console.log(data);
		if (data === 'exit') {
			goto('/lobby');
		} else {
			$matchData = data;
			$matchData.players = rebuildPlayers(data['players']);
		}
	});

	const leaveMatch = () => {
		$matchData = null;
		browser && localStorage.setItem('playing', 'false');
		$socketStore.emit('leave-match', {
			email: $session['email'],
			matchName: matchName
		});
		goto('/lobby');
	};
</script>

<section class="table" style={'background-image: url(' + assetsPath + '/rug.png);'}>
	{#if $matchData}
		<div class="grid info-layout">
			<div class="match-name">
				<p>Match: {matchName}</p>
			</div>

			<div class="host-message">
				{#key $matchData.message}
					<NotificationMatch message={$matchData.message} />
				{/key}
			</div>

			<div class="leave-match">
				<button on:click={leaveMatch} class="button leave">leave match</button>
			</div>
		</div>

		<div class="grid opponent-layout">
			{#if $matchData.players}
				{#each $matchData.players as player}
					{#if player.email !== $session['email']}
						<div class="opponent" in:fly={{ duration: 1500, x: 0, y: -40, easing: quintOut }}>
							<div class="oponent-info">
								<div>
									<p>username: {player.username}</p>
									<p>chips: {player.totalChips}</p>
								</div>
								<figure class="image is-square is-64x64 pt-1">
									<img class="is-rounded" src="{preview}{player.profilePicture}" alt="d" />
								</figure>
							</div>
							<CardHolder matchData={$matchData} {player} />
						</div>
					{/if}
				{/each}
			{/if}
		</div>

		<div class="grid community">
			{$matchData.rounds.potSize}
		</div>

		{#if $matchData.players}
			{#each $matchData.players as player}
				{#if player.email === $session['email']}
					<p class="is-invisible">{raiseHandler(raiseAmount, player.totalChips)}</p>
					<div class="grid you-layout" style={'background-image: url(' + assetsPath + '/wood.png)'}>
						<CardHolder matchData={$matchData} {player} />
						<p>{player.username}</p>
						{#if $matchData.rounds.currentPlayerMove === $session['email']}
							<div class="actions">
								<button
									class="nes-btn action-button"
									on:click={() => takeAction(PlayerActionEnum.CALL)}>Call ($0)</button
								>
								<button
									class="nes-btn action-button"
									on:click={() => takeAction(PlayerActionEnum.FOLD)}>Fold</button
								>
								<div class="action-raise">
									<button
										class="nes-btn action-button "
										on:click={() =>
											takeAction(
												raiseAmount >= player.totalChips
													? PlayerActionEnum.ALLIN
													: PlayerActionEnum.RAISE,
												raiseAmount
											)}
										>{raiseAmount >= player.totalChips
											? `All In: (${raiseAmount})`
											: `Raise: (${raiseAmount})`}</button
									>
									<input
										min="0"
										max={player.totalChips}
										bind:value={raiseAmount}
										type="number"
										class="nes-input raise-input"
									/>
								</div>
								{#if raiseAmount < player.totalChips}
									<button
										class="nes-btn action-button"
										on:click={() => takeAction(PlayerActionEnum.ALLIN)}
										>All In ({player.totalChips})</button
									>
								{/if}
							</div>
						{/if}
						{#if $matchData.host === $session['email']}
							<div class="host-control">
								{#if !$matchData.started}
									<button class="nes-btn host-button is-success" on:click={() => startMatch()}
										>Start match</button
									>
								{:else if $matchData['message'] === HostState.STARTED || $matchData['message'] === HostState.RESUMED}
									<button class="nes-btn host-button is-warning" on:click={() => pauseMatch()}
										>Pause match</button
									>
									<button class="nes-btn host-button is-error" on:click={() => stopMatch()}
										>Stop match</button
									>
								{:else if $matchData['message'] === HostState.PAUSED}
									<button class="nes-btn host-button is-success" on:click={() => resumeMatch()}
										>Resume match</button
									>
								{/if}
							</div>
						{/if}
					</div>
				{/if}
			{/each}
		{/if}
	{:else}
		<p class="is-size-3 nes-text has-text-centered mt-6">Loading...</p>
	{/if}
</section>

<style lang="scss">
	.table {
		padding: 1em;
		color: white;
		width: 100vw;
		height: 100vh;
		image-rendering: pixelated;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(5, 20%);
		gap: 0px 0px;
	}

	.info-layout {
		padding-bottom: 40px;
	}
	.leave-match {
		//position in grid
		grid-area: 1 / 5;
		display: flex;
		justify-self: right;
	}

	.host-message {
		grid-area: 1 / 3;
		display: flex;
		justify-self: center;
		text-align: center;
	}

	.oponent-layout {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.opponent {
		height: auto;
		padding: 20px;
		font-size: 10px;
		.oponent-info {
			display: flex;
			justify-content: space-between;
			flex-direction: row;
		}
	}

	.you-layout {
		justify-content: space-around;
		display: flex;
		padding: 20px;
		image-rendering: pixelated;
		height: auto;
		border: 3px solid black;
		.actions {
			display: flex;
		}
		.action-button {
			margin: 10px;
			height: fit-content;
		}
		.action-raise {
			width: 250px;
			display: flex;
			flex-direction: column;
		}
		.host-control {
			display: flex;
			flex-direction: column;
			.host-button {
				margin-top: 20px;
				height: fit-content;
				padding: 10px;
			}
		}
	}

	// row:     v (vertical)
	// collumn: > (horizontal)
	//grid-area: row-start  / collumn-start / row-end / collumn-end;
</style>
