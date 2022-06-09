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
    import { navigating, page, session } from "$app/stores";
    import { assets as assetsPath } from '$app/paths';
    import { socketStore, userStore } from "$lib/logic/frontend/entities/stores";
    import { writable, type Writable } from "svelte/store";
    import { onDestroy, onMount } from "svelte";
    import Player from "$lib/backend/entities/poker_rules/Player";
    import CardHolder from '../../../components/player/CardHolder.svelte';
    import { PlayerHand } from "$lib/backend/entities/poker_rules/hand/PlayerHand";
    import PlayingCard from "$lib/backend/entities/poker_rules/deck/card/PlayingCard";
    import { CardIdentity } from "$lib/backend/entities/poker_rules/deck/card/identity/CardIdentity";
    import { Phase } from "$lib/backend/entities/poker_rules/round/Phase";
    import { browser } from "$app/env";

    type Match = {
        started?: boolean;
        host?: Player['email'];
        name?: string;
        bigBlind?: number;
        maxPlayers?: number;
        rounds?: Round;
        players?: Player[];
    };

    type Round = {
        phase: Phase;
        roundsPlayed: number;
        potSize: number;
        currentPlayerMove: Player | null;
    };

    let matchData: Writable<Match> = writable();
    const matchName = $page.params['matchName'];
    let preview: string = `${assetsPath}/avatars/`;

    //Rebuilding of the backend Player array
    const rebuildPlayers = (players: Player[]): Player[] =>{
        const rebuildHand = (cards: Array<any>): PlayingCard[] => {
            const cardArray: PlayingCard[] = [];
            cards.forEach((card) => {
                cardArray.push(new PlayingCard(new CardIdentity(card.identity.suit, card.identity.value), card.state))
            })
            return cardArray
        }

        let newPlayerArray: Player[] = []
        players.forEach((player) => {
            const rebuildplayer = new Player(
                player.email, 
                player.username,
                player.profilePicture,
                player.totalChips,
                new PlayerHand(rebuildHand(player.hand.cards))
            )
            newPlayerArray.push(rebuildplayer)
        })
        return newPlayerArray
    }

    //socket io logic below
    onMount( () => {
        if(browser && JSON.parse(localStorage.getItem("playing"))){
            $socketStore.emit('get-match-data', {email: $session['email'],  matchName: matchName})
        }else{
            $socketStore.emit('join-match', {email: $session['email'],  matchName: matchName})
            browser && localStorage.setItem("playing", "true");
        }
	});

    const startMatch = () => {
        $socketStore.emit('start-match', {email: $session['email'],  matchName: matchName})
    }

    $socketStore.on('match-data', (data) => {
        $matchData = data;
        $matchData.players = rebuildPlayers(data['players'])
	})

    const leaveMatch = () => {
        browser && localStorage.setItem('playing', "false");
        $socketStore.emit('leave-match', {
            email: $session['email'],
			matchName: matchName
		});
        goto('/lobby')
    }

</script>

<section class="table" style={'background-image: url(' + assetsPath + '/rug.png);'}>
    {#if $matchData}
        <div class="grid info-layout">
            <div class='match-name'>
                <p>Match: {matchName}</p>
            </div>
        
            <div class='leave-match'>
                <button on:click={leaveMatch} class="button leave">leave match</button>
            </div>
        </div>

        <div class="grid opponent-layout">
            {#if $matchData.players}
                {#each $matchData.players as player}
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
                            <CardHolder matchData={$matchData} player={player} />
                        </div>
                    {/if}
                {/each}
            {/if}
        </div>

        <div class="grid community">
        </div>

        {#if $matchData.players}
            {#each $matchData.players as player}
                {#if player.email === $session['email']}
                    <div class="grid you-layout" style={'background-image: url(' + assetsPath + '/wood.png)'}>
                        <CardHolder matchData={$matchData} player={player} />
                        <p>{player.username}</p>
                        <div class="actions">
                            <button class="nes-btn action-button">Call ($0)</button>
                            <button class="nes-btn action-button">Fold</button>
                            <button class="nes-btn action-button">Raise ($250)</button>
                            <button class="nes-btn action-button">All In ($15000)</button>
                        </div>
                        {#if $matchData.host === $session['email'] && !$matchData.started}
                            <button class="nes-btn start is-success" on:click={() => startMatch()}>Start match</button>
                        {/if}
                    </div>
                {/if}
            {/each}
        {/if}
    {:else}
        <p>Loading...</p>
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