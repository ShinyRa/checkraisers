<script lang="ts">
	import { onMount } from 'svelte';
	import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";
	import { db } from '../firebase/firebase';
	import { fly } from 'svelte/transition';
	
	let loaded = false;
	let player;
	let players = [];
	onMount(() => {
		loaded = true;

		const pokerRef = collection(db, "poker")

		const unsubscribe = onSnapshot(pokerRef, (querySnapshot) => {
			players = []
			querySnapshot.forEach((doc) => {
				players = [...players, doc.data().name]
			});
		});
	});

	const add = async() => {
		await setDoc(doc(db, "poker", new Date().toString()), {
			chips: 1000,
			name: player
		});
	};

</script>

<section class="hero">
	<div class="hero-body">
		<p class="title">Poker app</p>
		<p class="subtitle">By Auke & Tijs</p>
	</div>
</section>

<div class="container">
	<input bind:value={player} /><br>
	<button on:click={add}>add player</button>
</div>

<div class="container">
	<ul>
		{#each players as player }
			<p in:fly={{ x: -100, duration: 250, delay: 0 }}>{player}</p>
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
	.container {
		text-align: center;
		font-size: 40px;
	}
</style>