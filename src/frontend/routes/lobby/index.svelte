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
	import { assets, assets as assetsPath } from '$app/paths';
	import { session } from '$app/stores';
	import { socketStore } from '$lib/logic/frontend/entities/stores';
	import { onMount } from 'svelte';
	import { writable, type Writable } from 'svelte/store';

	import MatchPopup from '../../components/match/MatchPopup.svelte';
	import Table from '../../components/Table.svelte';

	let matches: Writable<Array<string>> = writable([]);
	let overlay = false;

	const popup = () => {
		overlay = !overlay;
	};

	const createGame = (host = $session['email'], matchName, bigBlind, maxPlayers) => {
		if (matchName) {
			$socketStore.emit('new-match', {
				host: $session['email'],
				matchName,
				bigBlind,
				maxPlayers
			});
		}
	};

	const joinGame = (matchName) => {
		goto(`/lobby/match/${matchName}`);
	};

	onMount(() => {
		$socketStore.emit('join-lobby');
	});

	$socketStore.on('matches-list', (data) => {
		try {
			$matches = Object.values(data);
		} catch (err) {
			console.log('lobby err: ', err);
		}
	});
</script>

<section class="background" style={`background-image: url(${assetsPath}/wood_floor.jpg)`}>
	<MatchPopup onSubmit={createGame} {overlay} />

	<div class="poker-tables">
		<Table match={null} on:click={popup} />
		{#each $matches as match}
			<Table
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

	.poker-tables {
		padding: 100px;
		display: flex;
		flex-wrap: wrap;
	}
</style>
