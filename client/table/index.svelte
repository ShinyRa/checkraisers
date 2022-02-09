<script lang="ts">
	import { onMount } from 'svelte';
	import {db} from '../firebase/firebase';

	let loaded = false;
	let players = [];
	onMount(() => {
		loaded = true;
		db.collection("poker").orderBy("chips", "desc").onSnapshot( snapData => {
			players = snapData.docs
		});
	});
</script>

<section class="hero">
	<div class="hero-body">
		<p class="title">Poker app</p>
		<p class="subtitle">By Auke & Tijs</p>
	</div>
</section>

<div>
	<ul>
		{#each players as player }
			<li>{player.data().name}</li>
		{/each}
	</ul>
</div>

<style lang="scss">
	$svelte: #ff3e00;
	.hero {
		background-color: $svelte;
		p {
			color: white;
		}
	}
</style>