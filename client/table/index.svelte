<script lang="ts">
	import { onMount } from 'svelte';
	import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";
	import { db } from '../firebase/firebase';
	import { userAPI } from '../api/user/index'
	import { fly } from 'svelte/transition';
	import { post } from '../api/deck/index'
	
	let loaded = false;
	let player: string;
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

	const adduser = () => {
		userAPI.addUser({name: player, age: 20}).then((res)=> {
			console.log(res)
		});
	}
	
</script>

<section class="hero">
	<div class="hero-body">
		<p class="title">Poker app</p>
		<p class="subtitle">By Auke & Tijs</p>
	</div>
</section>

<div class="container">
	<input bind:value={player} /><br>
	<button on:click={adduser}>add player</button>
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