<script lang="ts">
	import { onMount } from 'svelte';
	import PlayingCard from './_PlayingCard.svelte';
	import { CardSuit } from './CardSuit';
	import { CardValue } from './CardValue';

	let loaded = false;
	onMount(() => {
		loaded = true;
	});
</script>

<section class="hero">
	<div class="hero-body">
		<p class="title">Card preview</p>
	</div>
</section>
<section class="preview">
	{#if loaded}
		{#each Object.values(CardSuit).filter((suit) => isNaN(Number(suit))) as suit}
			{#each Object.values(CardValue).filter((value) => isNaN(Number(value))) as value}
				<PlayingCard suit={CardSuit[suit]} value={CardValue[value]} />
			{/each}
		{/each}
	{/if}
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
		// padding-top: 125px;
		display: grid;
		grid-template-columns: repeat(13, 1fr);
	}
</style>
