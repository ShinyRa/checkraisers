<script lang="ts">
	import { deckAPI } from '../../api/deck/shuffle';
	import { onMount } from 'svelte';
	import PlayingCard from './_PlayingCard.svelte';

	let shuffled: Array<string>;
	let shown = [];

	onMount(() => {
		const { data } = deckAPI.shuffledDeck();
		shuffled = data;
		[1, 2, 3].forEach(draw);
	});

	const draw = () => {
		shown.push(shuffled.pop());
		shown = [...shown];
	};
</script>

<section class="hero">
	<div class="hero-body">
		<p class="title">Card preview</p>
	</div>
</section>
<section class="preview">
	<section class="cards">
		{#each shown as card}
			{@const [value, suit] = card.split('_OF_')}
			<PlayingCard {suit} {value} />
		{/each}
	</section>
	<button class="button is-primary is-large" on:click={draw}>Draw</button>
</section>

<style lang="scss">
	$svelte: #ff3e00;

	.hero {
		background-color: $svelte;
		p {
			color: white;
		}
	}
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
