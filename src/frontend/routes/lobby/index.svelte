<script context="module">
	export async function load({ session }) {
		if (!session.authenticated) {
			return {
				status: 302,
				redirect: '/'
			};
		}
        const socket = get(socketStore)
		return {};
	}
</script>

<script lang='ts'>
    import { goto } from "$app/navigation";
import { socketStore, userStore } from "$lib/logic/frontend/entities/stores";
    import { onMount } from "svelte";
    import { get, writable, type Writable } from "svelte/store";

    let matchName
    let bigBlind 
    let maxPlayers
    let matches: Writable<Array<string>> = writable([])

    onMount(() => {
        $socketStore.emit('join-lobby')
    })

    const createGame = () => {
        if(matchName){
            $socketStore.emit('new-match', {matchName: matchName, bigBlind: bigBlind, maxPlayers: maxPlayers})
        }
    }

    const joinGame = (slug) => {
        console.log("slug: ",slug)
        goto(`/lobby/match/${slug}`)
    }

    $socketStore.on('matches-list', (data) => {
        $matches = Object.values(data)
    })
</script>

<section>
    <div class="container is-flex is-flex-direction-column">
        <p class="is-size-1 has-text-centered">Game list</p>
        <hr>
        <input class="form-control input mb-2" bind:value={matchName} placeholder="game name" required>
        <input class="form-control input mb-2" bind:value={bigBlind} placeholder="big blind" type='number' required>
        <input class="form-control input mb-2" bind:value={maxPlayers} placeholder="max players" type='number' required>
        <button class="button" on:click={createGame}>Create match</button>
        <div class="table-container list">
            <table class="table ">
                <thead>
                    <th>name</th>
                    <th>players</th>
                    <th>big blind</th>
                    <th></th>
                </thead>
                <tbody>
                    {#each $matches as match }
                    {console.log(match)}
                        <tr>
                            <td>{match['name']}</td>
                            <td>{Object.keys(match['players']).length}/{match['maxPlayers']}</td>
                            <td>${match['bigBlind']}</td>
                            <!--nog een guard fixen-->
                            {#if Object.keys(match['players']).length < match['maxPlayers']}
                                <td><button class='button' on:click={() => {joinGame(match['name'])}}>join</button></td>
                            {/if}
                        </tr>
				    {/each}
                </tbody>
            </table>
        </div>
    </div>
</section>

<style lang="scss">
    $svelte: #ff3e00;

    button{
        background-color: $svelte;
        color: white;
        border: none;
        width: auto;
    }
    
    .list{
        margin-top: 20px;
    }

    .container {
        margin-top: 50px;
	}   

    section {
		margin: 0 auto;
	}
</style>