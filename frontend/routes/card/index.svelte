<script lang="ts">
	import { onMount } from 'svelte';
	import { deckAPI } from '$lib/api/deck';
	import { Card } from '$lib/entities/deck/card/Card';
	import PlayingCard from './_PlayingCard.svelte';

	let shuffled: Array<Card>;
	let shown = Array<Card>();

	onMount(() => {
		const { deck } = deckAPI.shuffleDeck();
		shuffled = deck;
		[1, 2, 3].forEach(draw);
	});

	const draw = () => {
		if (shuffled.length > 1) {
			shown.push(shuffled.pop());
			shown = [...shown];
		}
	};
</script>

<section class="preview">
	<section class="cards">
		{#each shown as card}
			<PlayingCard {card} />
		{/each}
	</section>
	<button class="button is-primary is-large" on:click={draw}>Draw</button>
</section>

<style lang="scss">
	.preview {
		background-color: #e3e3e3;
		height: 88vh;
		padding: 50px;
	}
	.cards {
		display: grid;
		grid-template-columns: repeat(10, 1fr);
		gap: 15px;
	}
</style>
