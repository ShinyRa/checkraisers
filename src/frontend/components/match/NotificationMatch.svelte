<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import type { Match } from '$lib/logic/frontend/components/match/Match';

	export let match: Match;
</script>

<div
	class="host-message is-size-6 nes-text has-text-centered"
	in:fly={{ duration: 1000, x: 0, y: -40, easing: quintOut }}
>
	{#if !match.rounds.winner}
		<p>{match.message}</p>
	{:else}
		<p>{match.rounds.winner.winner.username} has won</p>
		<p>{match.message}</p>
	{/if}
</div>

<style lang="scss">
</style>
