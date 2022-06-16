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
	import { fade, fly } from 'svelte/transition';
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
	import { GameState } from '$lib/logic/frontend/components/match/GameState';
	import NotificationMatch from '../../../components/match/NotificationMatch.svelte';
	import CPlayingCard from '../../../components/card/PlayingCard.svelte';
	import { quintOut } from 'svelte/easing';
	import { PlayerActionEnum } from '$lib/backend/entities/poker_rules/round/action/PlayerActionEnum';
	import type { Phase } from '$lib/backend/entities/poker_rules/round/Phase';

	const matchName = $page.params['matchName'];
	let matchData: Writable<Match> = writable();
	let preview: string = `${assetsPath}/avatars/`;
	let raiseAmount = 0;
	let playerTurn = writable(false);
	let actionMessage = writable('');

	const raiseHandler = (amount: number, totalChips: number) => {
		if (amount) {
			raiseAmount = amount > totalChips ? totalChips : amount;
		} else {
			raiseAmount = 0;
		}
	};

	const getPhase = (phase: Phase): string => {
		let phaseName;
		switch (phase) {
			case 0:
				phaseName = 'Pre flop';
				break;
			case 1:
				phaseName = 'Flop';
				break;
			case 2:
				phaseName = 'Turn';
				break;
			case 3:
				phaseName = 'River';
				break;
			case 4:
				phaseName = 'Evaluate';
				break;
			default:
				phaseName = 'Phase not found';
		}
		return phaseName;
	};

	//Rebuilding of the backend Player array
	const rebuildCards = (cards: Array<any>): PlayingCard[] => {
		const cardArray: PlayingCard[] = [];
		cards.forEach((card) => {
			cardArray.push(
				new PlayingCard(new CardIdentity(card.identity.suit, card.identity.value), card.state)
			);
		});
		return cardArray;
	};

	const rebuildPlayers = (players: Player[]): Player[] => {
		let newPlayerArray: Player[] = [];
		players.forEach((player) => {
			const rebuildplayer = new Player(
				player.email,
				player.username,
				player.profilePicture,
				player.totalChips,
				new PlayerHand(rebuildCards(player.hand.cards))
			);
			newPlayerArray.push(rebuildplayer);
		});
		return newPlayerArray;
	};

	const findCard = (winner, card: PlayingCard): boolean => {
		if (winner) {
			return (
				winner.winningHand.find((highlight: PlayingCard) => highlight.print() == card.print()) !=
				undefined
			);
		} else {
			return false;
		}
	};
	const revealCards = (cards: PlayingCard[]): PlayingCard[] => {
		cards.forEach((card) => {
			card.reveal();
		});
		return cards;
	};

	//socket io logic below
	onMount(() => {
		$socketStore.emit('join-match', { email: $session['email'], matchName: matchName });
	});

	const startMatch = async () => {
		$socketStore.emit('start-match', { email: $session['email'], matchName: matchName });
	};

	const replay = async () => {
		$socketStore.emit('replay-match', { email: $session['email'], matchName: matchName });
	};

	const pauseMatch = async () => {
		$socketStore.emit('pause-match', { email: $session['email'], matchName: matchName });
	};

	const stopMatch = () => {
		$socketStore.emit('stop-match', { email: $session['email'], matchName: matchName });
	};

	const resumeMatch = async () => {
		$socketStore.emit('resume-match', { email: $session['email'], matchName: matchName });
	};

	const takeAction = async (action: PlayerActionEnum, amount?: number) => {
		const actionObject = amount
			? { playerAction: action, chips: amount }
			: { playerAction: action };
		if ($playerTurn) {
			switch (action) {
				case PlayerActionEnum.CALL:
					$actionMessage = 'Je hebt gecalled';
					break;
				case PlayerActionEnum.RAISE:
					$actionMessage = `Je hebt geraised met ${amount}`;
					break;
				case PlayerActionEnum.FOLD:
					$actionMessage = 'Je hebt gefold';
					break;
				case PlayerActionEnum.ALLIN:
					$actionMessage = `Je bent all-in gegaan`;
					break;
				default:
					$actionMessage = '';
					break;
			}
			$socketStore.emit('player-action', {
				email: $session['email'],
				matchName: matchName,
				action: actionObject
			});
		}
	};

	$socketStore.on('match-data', async (data) => {
		try {
			if (data === 'exit') {
				goto('/lobby');
			} else {
				$matchData = data;
				$matchData.players = rebuildPlayers(data['players']);
				$matchData.rounds.communityCards = rebuildCards($matchData.rounds.communityCards);
				$playerTurn = $matchData.rounds.currentPlayerMove === $session['email'];
				let localUser = $userStore.getUserData();
				for (let i = 0; i < $matchData.players.length; i++) {
					if ($matchData.players[i].email === $session['email']) {
						localUser.chips = $matchData.players[i].totalChips;
						userStore.update((currentUser) => {
							currentUser.setUserData(localUser);
							return currentUser;
						});
					}
				}
				if ($matchData.rounds.winner) {
					$matchData.rounds.winner.winningHand = rebuildCards($matchData.rounds.winner.winningHand);
				}
			}
		} catch (err) {
			console.log('match data: ', err);
		}
	});

	const leaveMatch = () => {
		$matchData = null;
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
					<NotificationMatch match={$matchData} />
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
						<div
							class="opponent"
							in:fly={{ duration: 1500, x: 0, y: -40, easing: quintOut }}
							style={'background-image: url(' + assetsPath + '/wall-tile.jpg)'}
						>
							<div class="oponent-info">
								<div>
									<p>username: {player.username}</p>
									<p>chips: {player.totalChips}</p>
								</div>
								<figure class="image is-square is-64x64 pt-1">
									<img class="is-rounded" src="{preview}{player.profilePicture}" alt="d" />
								</figure>
							</div>
							<CardHolder {findCard} matchData={$matchData} cards={player.hand.cards} />
						</div>
					{/if}
				{/each}
			{/if}
		</div>

		<div class="community-layout">
			<div class="game-info" style={'background-image: url(' + assetsPath + '/wall-tile.jpg)'}>
				<p>potsize: {$matchData.rounds.potSize}</p>
				<p>phase: {getPhase($matchData.rounds.phase)}</p>
			</div>
			{#each $matchData.rounds.communityCards as card}
				<CPlayingCard {card} highlight={findCard($matchData.rounds.winner, card)} />
			{/each}
		</div>

		{#if $matchData.players}
			{#each $matchData.players as player}
				{#if player.email === $session['email']}
					<p class="is-invisible">{raiseHandler(raiseAmount, player.totalChips)}</p>
					<div class="grid you-parent-layout">
						<div
							class="grid you-child-layout"
							style={'background-image: url(' + assetsPath + '/wood.png)'}
						>
							<CardHolder
								{findCard}
								matchData={$matchData}
								cards={revealCards(player.hand.cards)}
							/>
							<div class="actions ">
								<button
									class="nes-btn action-button {$playerTurn ? '' : 'is-disabled'}"
									on:click={() => takeAction(PlayerActionEnum.CALL)}>Call</button
								>
								<button
									class="nes-btn action-button {$playerTurn ? '' : 'is-disabled'}"
									on:click={() => takeAction(PlayerActionEnum.FOLD)}>Fold</button
								>
								<div class="action-raise">
									<button
										class="nes-btn action-button {$playerTurn ? '' : 'is-disabled'}"
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
										class="nes-input raise-input {$playerTurn ? '' : 'is-disabled'}"
									/>
								</div>
								{#if raiseAmount < player.totalChips}
									<button
										class="nes-btn action-button {$playerTurn ? '' : 'is-disabled'}"
										on:click={() => takeAction(PlayerActionEnum.ALLIN)}
										>All In ({player.totalChips})</button
									>
								{/if}
								{#if $matchData.host === $session['email']}
									<div class="host-control">
										{#if $matchData.state === GameState.NOT_STARTED}
											<button class="nes-btn host-button is-success" on:click={() => startMatch()}
												>Start match</button
											>
										{:else if $matchData.state === GameState.PAUSED}
											<button class="nes-btn host-button is-success" on:click={() => resumeMatch()}
												>Resume match</button
											>
										{:else if $matchData.state === GameState.STARTED}
											<button class="nes-btn host-button is-warning" on:click={() => pauseMatch()}
												>Pause match</button
											>
										{:else if $matchData.state === GameState.EVALUATION}
											<button class="nes-btn is-success" on:click={() => replay()}
												>Play again</button
											>
										{/if}

										<button class="nes-btn host-button is-error" on:click={() => stopMatch()}
											>Stop match</button
										>
									</div>
								{/if}
							</div>
						</div>
						{#if $actionMessage}
							{#key $actionMessage}
								<p
									transition:fly={{ duration: 1000, x: -100, y: 0 }}
									class="nes-balloon from-left text-balloon action-bubble"
								>
									{$actionMessage}
								</p>
							{/key}
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
		padding: 20px;
		display: grid;
		margin-top: 68px;
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
		padding: 20px;
		margin-top: 2vh;
		padding-bottom: 4vh;
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
		grid-area: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.opponent {
		width: 97%;
		background-repeat: round;
		border: 4px solid black;
		border-radius: 10px;
		height: 300px;
		padding: 20px;
		font-size: 11px;
		.oponent-info {
			display: flex;
			justify-content: space-between;
			flex-direction: row;
		}
	}
	.community-layout {
		margin-top: 50px;
		margin-bottom: 50px;
		display: grid;
		grid-template-columns: 20% repeat(5, 10%);
		height: 183px;
	}

	.game-info {
		width: 90%;
		height: 100%;
		background-repeat: round;
		border: 4px solid black;
		border-radius: 10px;
		padding: 10px;
	}

	.you-parent-layout {
		grid-area: 4;
	}
	.you-child-layout {
		width: 100%;
		grid-area: 1 / 1 / 1 / 5;
		border-radius: 1em;
		padding: 20px;
		image-rendering: pixelated;
		border: 3px solid black;
		.actions {
			grid-area: 1 / 3 / 1 / 6;
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
			margin-right: auto;
			.host-button {
				margin-top: 20px;
				height: fit-content;
				padding: 10px;
			}
		}
	}
	.action-bubble {
		height: auto;
		color: black;
		grid-area: 1 / 5 / 1 / 5;
	}

	// row:     v (vertical)
	// collumn: > (horizontal)
	//grid-area: row-start  / collumn-start / row-end / collumn-end;
</style>
