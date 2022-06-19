<script lang="ts">
	import { assets as assetsPath } from '$app/paths';
	import { fade } from 'svelte/transition';

	export let match = null;
	export let click;
	let hover = false;
	const isHovering = () => (hover = true);
	const isNotHovering = () => (hover = false);
	const getTableAssetForPlayers = (players: number, maxPlayers): string => {
		if (players >= 6) {
			return 'table_5.png';
		}

		return `table_${players}.png`;
	};
</script>

{#if match == null}
	<div class="poker-table nes-pointer">
		<div class="header">
			<div class="game-details" on:click={click}>
				<img class="match" alt="poker table" src={assetsPath + '/table/table_0.png'} />
				<span class="details">+ create new table</span>
			</div>
		</div>
	</div>
{:else}
	<div class="poker-table nes-pointer">
		{#if hover}
			<div class="nes-balloon from-left hover" in:fade>
				{#if match['players'].length > 0}
					{#each match['players'] as player}
						<div class="player">
							<img src={assetsPath + '/avatars/' + player.profilePicture} class="picture" />
							<span>{player.username}</span>
						</div>
					{/each}
				{:else}
					<span>Be the first to join...</span>
				{/if}
			</div>
		{/if}
		<div class="header" on:mouseenter={isHovering} on:mouseleave={isNotHovering}>
			<div class="game-details">
				<img
					class="rug"
					src={assetsPath + '/table/rug/rug_' + Math.floor(Math.random() * 14 + 1) + '.png'}
				/>
				<img
					class="match"
					src={assetsPath +
						'/table/' +
						getTableAssetForPlayers(Object.keys(match['players']).length, match['maxPlayers'])}
				/>
				<span class="details">{match['name']} </span>
				<span class="player-count">
					{Object.keys(match['players']).length}/{match['maxPlayers']}
				</span>
			</div>
		</div>

		{#if Object.keys(match['players']).length < match['maxPlayers']}
			<button class="nes-btn is-primary" on:click={click}>join</button>
		{/if}
	</div>
{/if}

<style lang="scss">
	.poker-table {
		justify-content: center;
		margin: 25px;
		flex: 1 1 15rem;
		position: relative;
		display: flex;
		flex-direction: column;
		text-align: center;
		.header {
			justify-content: center;
			display: flex;
			flex-direction: row;
			margin-bottom: 2rem;
			.game-details {
				display: flex;
				flex-direction: column;
				.match {
					align-self: center;
					height: 200px;
					width: 200px;
					z-index: 2;
				}
				.rug {
					position: absolute;
					left: 0;
					top: -1rem;
					image-rendering: pixelated;
					height: 110%;
					width: 100%;
					z-index: 0;
					border-radius: 4%;
					border: 3px solid rgb(53, 0, 0);
				}
				.details {
					padding-top: 25px;
					color: white;
					z-index: 2;
				}
				.player-count {
					position: absolute;
					top: 20%;
					left: 0;
					width: 100%;
					z-index: 2;
					color: white;
				}
			}
		}
		.nes-btn {
			width: 80%;
			margin: 0 auto;
		}

		.hover {
			max-width: auto;
			position: absolute;
			left: 70%;
			top: -15%;
			z-index: 999;
			.picture {
				height: 45px;
				width: 45px;
				border-radius: 100%;
			}
			span {
				font-size: 0.8rem;
			}
		}
	}
</style>
