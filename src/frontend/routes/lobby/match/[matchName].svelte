<script context='module'>
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

<script lang='ts'>
    import { goto } from "$app/navigation";
    import { page, session } from "$app/stores";
    import { assets as assetsPath } from '$app/paths';
    import { socketStore, userStore } from "$lib/logic/frontend/entities/stores";
    import { writable, type Writable } from "svelte/store";
    import { onDestroy } from "svelte";
    import Player from "$lib/backend/entities/poker_rules/Player";
	import PlayingCard from '../../../components/card/PlayingCard.svelte';

    let matchData = writable();
    let players: Writable<Player[]> = writable();
    const matchName = $page.params['matchName'];


    const startMatch = () => {
        $socketStore.emit('start-match', {email: $session['email'],  matchName: matchName})
    }

    //socket io logic below
    $socketStore.emit('join-match', {email: $session['email'],  matchName: matchName})

    $socketStore.on('match-data', (data) => {
		$matchData = data;
        $players = Object.values(data['players'])
        console.log($matchData)
	})

    const leaveMatch = () => {
        $socketStore.emit('leave-match', {
			matchName: matchName,
			email: $session['email']
		});
        goto('/lobby')
    }

    onDestroy(() => {
        $socketStore.emit('leave-match', {
			matchName: matchName,
			email: $session['email']
		});
    })
    let preview: string = `${assetsPath}/avatars/`;
</script>

<section class="table" style={'background-image: url(' + assetsPath + '/rug.png);'}>

    <div class="grid info-layout">
        <div class='match-name'>
            <p>Match: {matchName}</p>
        </div>
    
        <div class='leave-match'>
            <button on:click={leaveMatch} class="button leave">leave match</button>
        </div>
    </div>

    <div class="grid opponent-layout">
        {#if $players}
            {#each $players as player}
                {#if player.email !== $session['email']}
                    <div class="opponent">
                        <div class="oponent-info">
                            <div>
                                <p>username: {player.username}</p>
                                <p>chips: {player.totalChips}</p>
                            </div>
                            <figure class="image is-square is-64x64 pt-1">
                                <img
                                    class="is-rounded"
                                    src="{preview}{player.profilePicture}"
                                    alt="d"
                                />
                            </figure>
                        </div>
                        {#if $matchData['started'] && player.hand}
                            <div class="card-holder">
                                {player.hand.reveal()}
                                {#each player.hand.cards as card}
                                    <PlayingCard {card} highlight/>
                                {/each}
                            </div>
                        {/if}
                    </div>
                {/if}
            {/each}
        {/if}
    </div>

    <div class="grid community">
    </div>

    {#if $players}
        {#each $players as player}
            {#if player.email === $session['email']}
                <div class="grid you-layout" style={'background-image: url(' + assetsPath + '/wood.png)'}>
                    <p>{player.username}</p>
                    <div class="actions">
						<a class="nes-btn action-button" href="#" on:click={() => takeAction('I call', 'call.wav')}
							>Call ($0)</a
						>
						<a class="nes-btn action-button" href="#" on:click={() => takeAction('I fold', 'fold.wav')}>Fold</a>
						<a
							class="nes-btn action-button"
							href="#"
							on:click={() => takeAction('I Raise with $250', 'raise.wav')}>Raise ($250)</a
						>
						<a
							class="nes-btn action-button"
							href="#"
							on:click={() => takeAction("I'm all in for $15.000", 'allin.wav')}>All In ($15000)</a
						>
					</div>

                    {#if $matchData['host'] === $session['email'] && !$matchData['started']}
                        <button class="nes-btn start is-success" on:click={() => startMatch()}>Start match</button>
                    {/if}
                </div>
            {/if}
        {/each}
    {/if}

</section>

<style lang='scss'>
    .table {
        padding: 1em;
        color: white;
        width: 100vw;
        height: 100vh;
        image-rendering: pixelated;
    }
    .grid{
        display: grid;
        grid-template-columns: repeat(5, 20%);
        gap: 0px 0px; 
    }

    .info-layout{
        padding-bottom: 40px;
    }
    .leave-match{
        //position in grid
        grid-area: 1 / 5;
        display: flex;
        justify-self: right;
    }

    .oponent-layout{
        display: flex;
		flex-direction: column;
		justify-content: center;
    }
    .opponent{
        height: auto;
        padding: 20px;
        font-size: 10px;
        .oponent-info{
            display: flex;
            justify-content: space-between;
            flex-direction: row;
        }
    }

    .you-layout{
        justify-content: space-around;
        display: flex;
        padding: 20px;
		image-rendering: pixelated;
		height: 200px;
		border: 3px solid black;
        .actions{
            display: flex;
        }
        .action-button{
            margin: 10px;
            height: fit-content;
        }
        .start{
            height: fit-content;
            padding: 30px;
        }
    }





    // row:     v (vertical)
    // collumn: > (horizontal) 
    //grid-area: row-start  / collumn-start / row-end / collumn-end;
</style>