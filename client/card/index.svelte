<script lang="ts">
	import { API } from '../api/client';
	import { onMount } from 'svelte';
	import PlayingCard from './_PlayingCard.svelte';

	let shuffled;
	let shown = [];

	onMount(async () => {
		const { data } = await API.shuffledDeck();
		shuffled = data;
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
	{#each shown as card}
		{@const [value, suit] = card.split('_OF_')}
		<PlayingCard {suit} {value} />
	{/each}
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
		display: grid;
		grid-template-columns: repeat(13, 1fr);
	}
</style>
