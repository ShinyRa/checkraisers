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
    import { socketStore } from "$lib/logic/frontend/entities/stores";
    import { writable } from "svelte/store";

    let matchData = writable();
    const matchName = $page.params['matchName']

    $socketStore.emit('join-match', {email: $session['email'],  matchName: matchName})

    $socketStore.on('match-data', (data) => {
		$matchData = data;
        console.log($matchData)
	})

    const leaveMatch = () => {
        $socketStore.emit('leave-match', {
			matchName: matchName,
			email: $session['email']
		});
        goto('/lobby')
    }

    //$socketStore.emit('join-match', {email: $session['email'],  matchName: matchName})





    //  TODO match
    //  - current round / max rounds
    //  
    //
    //
    //
    //

    //get match data.

    //keep track phases.

    //round progression.
</script>

<section class='table' style={'background-image: url(' + assetsPath + '/rug.png);'}>

    <div class='match-name'>
        <p>Match: {matchName}</p>
    </div>

    <div class='leave-match'>
        <button on:click={leaveMatch} class="button leave">leave match</button>
    </div>

    
</section>

<style lang='scss'>
    .table {
        padding: 1em;
        color: white;
        width: 100vw;
        height: 100vh;
        display: grid; 
        grid-template-columns: repeat(5, 20%);
        grid-template-rows: 4% repeat(3, 32%);
        gap: 0px 0px; 
        grid-template-areas: 
            'info info info info info'
            'oponent oponent oponent oponent oponent'
            'community community community community community'
            'you you you you you'; 

    }

    // row:     v (vertical)
    // collumn: > (horizontal) 
    //grid-area: row-start  / collumn-start / row-end / collumn-end;
    .match-name{
        //position in grid
        grid-area: 1 / 1 / 1 / 1;

    }

    .leave-match{
        //position in grid
        grid-area: 1 / 5 / 1 / 5;

        display: flex;
        justify-self: right;
    }


</style>