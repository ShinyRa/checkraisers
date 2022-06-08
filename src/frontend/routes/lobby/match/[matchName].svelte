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

    let matchData = writable();
    let players: Writable<Player[]> = writable();
    const matchName = $page.params['matchName'];

    //socket io logic below
    $socketStore.emit('join-match', {email: $session['email'],  matchName: matchName})

    $socketStore.on('match-data', (data) => {
		$matchData = data;
        $players = Object.values(data['players'])
        console.log($players)
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
                    <div class="card-holder">
                        testing
                    </div>
                </div>
            {/each}
        {/if}
    </div>

    <div class="grid community">
    </div>

    <div class="grid you">
    </div>




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
        grid-area: oponent;
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


    // row:     v (vertical)
    // collumn: > (horizontal) 
    //grid-area: row-start  / collumn-start / row-end / collumn-end;
</style>